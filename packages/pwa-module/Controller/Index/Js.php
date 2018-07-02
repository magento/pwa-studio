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
use Magento\Pwa\Helper\WebpackConfig;
use Magento\Pwa\Model\Result\JsFileResultFactory;

/**
 * Class Js
 * @package Magento\Pwa\Controller\Index
 */
class Js extends Action
{
    /**
     * @var WebpackConfig $webpackConfig
     */
    private $webpackConfig;

    /**
     * @var JsFileResultFactory
     */
    private $jsFileResultFactory;

    /**
     * Index constructor.
     *
     * @param WebpackConfig $webpackConfig
     * @param Context $context
     * @param JsFileResultFactory $jsFileResultFactory
     */
    public function __construct(
        WebpackConfig $webpackConfig,
        Context $context,
        JsFileResultFactory $jsFileResultFactory
    )
    {
        parent::__construct($context);
        $this->webpackConfig = $webpackConfig;
        $this->jsFileResultFactory = $jsFileResultFactory;
    }

    /**
     * @inheritdoc
     */
    public function execute()
    {
        $filePath = implode(DIRECTORY_SEPARATOR, [
            $this->webpackConfig->getThemePath(),
            'web',
            'js',
            $this->webpackConfig->getServiceWorkerFileName()
        ]);

        if (file_exists($filePath)) {
            $result = $this->jsFileResultFactory->create();
            $result->setHttpResponseCode(200);
            $result->sendJSFile($filePath);
            return $result;
        }

        /** @var Raw $result */
        $result = $this->resultFactory->create(ResultFactory::TYPE_RAW);
        $result->setHttpResponseCode(404);
        $result->setContents('404: Could not find ' . $this->webpackConfig->getServiceWorkerFileName());

        return $result;
    }
}
