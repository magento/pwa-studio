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

namespace Magento\Pwa\Controller\Index;

use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;
use Magento\Framework\Controller\Result\Raw;
use Magento\Framework\Controller\ResultFactory;
use Magento\Pwa\Model\Result\ServiceWorkerResultFactory;
use Magento\Pwa\Model\Result\ServiceWorkerResult;

/**
 * Class ServiceWorker
 * @package Magento\Pwa\Controller\Index
 */
class ServiceWorker extends Action
{
    /**
     * @var ServiceWorkerResultFactory
     */
    private $serviceWorkerResultFactory;

    /**
     * Action constructor.
     *
     * @param Context $context
     * @param \Magento\Framework\View\Asset\Repository $assetRepository
     * @param ServiceWorkerResultFactory $serviceWorkerResultFactory
     */
    public function __construct(
        Context $context,
        \Magento\Framework\View\Asset\Repository $assetRepository,
        ServiceWorkerResultFactory $serviceWorkerResultFactory
    )
    {
        parent::__construct($context);
        $this->assetRepository = $assetRepository;
        $this->serviceWorkerResultFactory = $serviceWorkerResultFactory;
    }

    /**
     * @inheritdoc
     */
    public function execute()
    {
        $params = [];
        $serviceWorkerContent = $this->assetRepository->updateDesignParams($params)->createAsset(ServiceWorkerResult::SERVICE_WORKER_FILENAME)->getContent();

        $result = $this->serviceWorkerResultFactory->create();
        $result->setHttpResponseCode(200);
        $result->sendServiceWorker($serviceWorkerContent);
        return $result;
    }
}
