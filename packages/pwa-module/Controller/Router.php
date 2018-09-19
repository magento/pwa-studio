<?php
declare(strict_types=1);

namespace Magento\Pwa\Controller;

use Magento\Framework\App\Action\Forward;
use Magento\Framework\App\ActionFactory;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\App\RouterInterface;
use Magento\Pwa\Model\Result\ServiceWorkerResult;

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
     * Router constructor.
     * @param ActionFactory $actionFactory
     */
    public function __construct(
        ActionFactory $actionFactory
    ) {
        $this->actionFactory = $actionFactory;
    }

    /**
     * @inheritdoc
     */
    public function match(RequestInterface $request)
    {
        $rootPath = trim($request->getPathInfo(), '/');
        if ($rootPath == ServiceWorkerResult::SERVICE_WORKER_FILENAME) {
            $request->setModuleName('pwa')
                ->setControllerName('index')
                ->setActionName('serviceworker');
            return $this->actionFactory->create(
                Forward::class
            );
        }
        return null;
    }
}
