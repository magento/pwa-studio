<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 * Created by PhpStorm.
 * User: jzetlen
 * Date: 1/25/18
 * Time: 10:14 AM
 */
declare(strict_types=1);

namespace Magento\Pwa\Helper;

use JsonSerializable;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\Filesystem\DirectoryList;
use Magento\Framework\Exception\FileSystemException;
use Magento\Framework\UrlInterface;
use Magento\Framework\View\Asset\Repository;
use Magento\Framework\View\Config;
use Magento\Framework\View\ConfigInterface;
use Magento\Framework\View\Design\Theme\ThemeProviderInterface;
use Magento\Framework\View\Design\ThemeInterface;
use Magento\Framework\View\DesignInterface;
use Magento\Store\Model\ScopeInterface;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Theme\Model\Theme;
use ReflectionClass;
use ReflectionException;
use ReflectionMethod;

/**
 * Class WebpackConfig
 * @package Magento\Pwa\Helper
 */
class WebpackConfig implements JsonSerializable
{
    /**
     * Namespace of the PWA module
     */
    const PWA_MODULE_NAME = 'Magento_Pwa';

    /**
     * This is not going to change because PWA dev requires HTTPS.
     */
    const DEVSERVER_PROTOCOL = 'https';

    /**
     * Name of the bundle file size configuration setting
     */
    const DEVSERVER_HOSTNAME_VAR = 'devserver_host';

    /**
     * Dev server host almost all of the time
     */
    const DEFAULT_DEVSERVER_HOSTNAME = 'localhost';

    /**
     * Name of the bundle file size configuration setting
     */
    const DEVSERVER_PORT_VAR = 'devserver_port';

    /**
     * Dev server port almost all of the time
     */
    const DEFAULT_DEVSERVER_PORT = '8080';

    /**
     * Name of the bundle file size configuration setting
     */
    const SERVICE_WORKER_NAME_VAR = 'serviceworker_name';

    /**
     * Default service worker name
     */
    const DEFAULT_SERVICE_WORKER_NAME = 'sw.js';

    /**
     * @var Config
     */
    private $_viewConfig;

    /**
     * @var string
     */
    private $_themePath;

    /**
     * @var string
     */
    private $_serviceWorkerFileName;

    /**
     * @var string
     */
    private $_publicAssetPath;

    /**
     * @var string
     */
    private $_devServerHostname;

    /**
     * @var string
     */
    private $_storeOrigin;

    /**
     * @var string
     */
    private $_devServerPort;

    /**
     * @var DirectoryList
     */
    private $_directoryList;

    /**
     * @var ThemeProviderInterface
     */
    private $_themeProvider;

    /**
     * @var ScopeConfigInterface
     */
    private $_scopeConfig;

    /**
     * @var StoreManagerInterface
     */
    private $_storeManager;

    /**
     * @var Repository
     */
    private $_assetRepo;

    /**
     * @var UrlInterface
     */
    private $_baseUrl;

    /**
     * ViewConfig constructor.
     * @param ConfigInterface $viewConfig
     * @param DirectoryList $directoryList
     * @param ThemeProviderInterface $themeProvider
     * @param ScopeConfigInterface $scopeConfig
     * @param StoreManagerInterface $storeManager
     */
    public function __construct(
        \Magento\Framework\UrlInterface $baseUrl,
        ConfigInterface $viewConfig,
        DirectoryList $directoryList,
        ThemeProviderInterface $themeProvider,
        ScopeConfigInterface $scopeConfig,
        StoreManagerInterface $storeManager,
        Repository $assetRepo
    )
    {
        $this->_viewConfig = $viewConfig;
        $this->_directoryList = $directoryList;
        $this->_themeProvider = $themeProvider;
        $this->_scopeConfig = $scopeConfig;
        $this->_storeManager = $storeManager;
        $this->_assetRepo = $assetRepo;
        $this->_baseUrl = $baseUrl;
    }

    /**
     * Get the base origin of the store.
     *
     * @return string
     */
    public function getStoreOrigin(): string
    {
        if (empty($this->_storeOrigin)) {
            $this->_storeOrigin = $this->_baseUrl->getBaseUrl(['_secure' => true]);
        }

        return $this->_storeOrigin;
    }

    /**
     * Get the public URL path of the service worker
     *
     * @return string
     */
    public function getPublicAssetPath(): string
    {
        if (empty($this->_publicAssetPath)) {
            $this->_publicAssetPath = "/" . trim(str_replace(
                    $this->getStoreOrigin(),
                    "",
                    $this->_baseUrl->getBaseUrl(['_type' => UrlInterface::URL_TYPE_STATIC, '_secure' => true]) .
                    $this->_assetRepo->createAsset("/")->getPath()
                ), "/") . "/";
        }

        return $this->_publicAssetPath;
    }

    /**
     * Get the name of the service worker file
     * @return string
     */
    public function getServiceWorkerFileName(): string
    {
        if (empty($this->_serviceWorkerFileName)) {
            $this->_serviceWorkerFileName = (string) $this->_getVarOrFallback(
                self::SERVICE_WORKER_NAME_VAR,
                self::DEFAULT_SERVICE_WORKER_NAME
            );
        }
        return $this->_serviceWorkerFileName;
    }

    /**
     * Get the absolute filesystem path of the theme
     *
     * @return string
     * @throws FileSystemException
     */
    public function getThemePath(): string
    {
        if (empty($this->_themePath)) {
            $this->_themePath = implode(DIRECTORY_SEPARATOR, [
                $this->_directoryList->getPath('app'),
                "design",
                $this->_getTheme()->getFullPath()
            ]);
        }

        return $this->_themePath;
    }

    /**
     * @return string
     */
    public function getDevServerHostname(): string
    {
        if (empty($this->_devServerHostname)) {
            $this->_devServerHostname = (string) $this->_getVarOrFallback(
                self::DEVSERVER_HOSTNAME_VAR,
                self::DEFAULT_DEVSERVER_HOSTNAME
            );
        }

        return $this->_devServerHostname;
    }

    /**
     * @return string
     */
    public function getDevServerPort(): string
    {
        if (empty($this->_devServerPort)) {
            $this->_devServerPort = (string) $this->_getVarOrFallback(
                self::DEVSERVER_PORT_VAR,
                self::DEFAULT_DEVSERVER_PORT
            );
        }

        return $this->_devServerPort;
    }

    /**
     * Get the configured local webpack-dev-server hostname
     * @return string
     */
    public function getDevServerHost(): string
    {
        // TODO: proper URL builder
        return self::DEVSERVER_PROTOCOL . "://" . $this->getDevServerHostname() . ":" . $this->getDevServerPort();
    }

    /**
     * @return array
     * @throws ReflectionException
     */
    public function jsonSerialize(): array
    {
        $class = new ReflectionClass(self::class);
        $methods = $class->getMethods(ReflectionMethod::IS_PUBLIC);
        $properties = [];
        foreach ($methods as $method) {
            $name = $method->getName();
            if (preg_match('/^get[A-Z0-9]/', $name)) {
                $propName = lcfirst(substr($name, 3));
                $properties[$propName] = $method->invoke($this);
            }
        }

        return $properties;
    }

    /**
     * Get the currently active theme instance
     *
     * @return ThemeInterface
     */
    private function _getTheme(): ThemeInterface
    {

        $themeId = $this->_scopeConfig->getValue(
            DesignInterface::XML_PATH_THEME_ID,
            ScopeInterface::SCOPE_STORE,
            $this->_storeManager->getStore()->getId()
        );

        return $this->_themeProvider->getThemeById($themeId);
    }

    /**
     * Get a variable from view.xml or fall back to a default value
     *
     * @param string $name variable name
     * @param string $fallback value if var is null
     * @return string|false
     */
    private function _getVarOrFallback($name, $fallback)
    {
        $varValue = $this->_viewConfig->getViewConfig()->getVarValue(self::PWA_MODULE_NAME, $name);
        return empty($varValue) ? $fallback : $varValue;
    }
}
