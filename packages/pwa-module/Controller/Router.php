<?php

namespace Magento\Pwa\Controller;

class Router implements \Magento\Framework\App\RouterInterface
{
    /** @var \Magento\Framework\App\ActionFactory $actionFactory */
    private $actionFactory;

    /**
     * @var \Magento\Pwa\Helper\WebpackConfig $webpackConfig
     */
    private $webpackConfig;

    public function __construct(
        \Magento\Pwa\Helper\WebpackConfig $webpackConfig,
        \Magento\Framework\App\ActionFactory $actionFactory
    )
    {
        $this->actionFactory = $actionFactory;
        $this->webpackConfig = $webpackConfig;
    }

    /**
     * @inheritdoc
     */
    public function match(\Magento\Framework\App\RequestInterface $request)
    {
        $rootPath = trim($request->getPathInfo(), '/');
        if ($rootPath == $this->webpackConfig->getServiceWorkerFileName()) {
            $request->setModuleName('pwa')
                ->setControllerName('index')
                ->setActionName('js');
            return $this->actionFactory->create(
                \Magento\Framework\App\Action\Forward::class
            );
        }
        if ($rootPath == "webpack-config.json") {
            $request->setModuleName('pwa')
                ->setControllerName('index')
                ->setActionName('webpackconfigendpoint');
            return $this->actionFactory->create(
                \Magento\Framework\App\Action\Forward::class
            );
        }
        return null;
    }
}