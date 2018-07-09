<?php
declare(strict_types=1);

namespace Magento\Pwa\Controller;

use Magento\Framework\App\Action\Forward;
use Magento\Framework\App\ActionFactory;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\App\RouterInterface;
use Magento\Pwa\Helper\WebpackConfig;

/**
 * Class Router
 * @package Magento\Pwa\Controller
 */
class Router implements RouterInterface
{
    /**
     * @var ActionFactory $actionFactory
     */
    private $actionFactory;

    /**
     * @var WebpackConfig $webpackConfig
     */
    private $webpackConfig;

    /**
     * Router constructor.
     * @param WebpackConfig $webpackConfig
     * @param ActionFactory $actionFactory
     */
    public function __construct(
        WebpackConfig $webpackConfig,
        ActionFactory $actionFactory
    ) {
        $this->actionFactory = $actionFactory;
        $this->webpackConfig = $webpackConfig;
    }

    /**
     * @inheritdoc
     */
    public function match(RequestInterface $request)
    {
        $rootPath = trim($request->getPathInfo(), '/');
        if ($rootPath == $this->webpackConfig->getServiceWorkerFileName()) {
            $request->setModuleName('pwa')
                ->setControllerName('index')
                ->setActionName('js');
            return $this->actionFactory->create(
                Forward::class
            );
        }
        if ($rootPath == "webpack-config.json") {
            $request->setModuleName('pwa')
                ->setControllerName('index')
                ->setActionName('webpackconfigendpoint');
            return $this->actionFactory->create(
                Forward::class
            );
        }
        return null;
    }
}
