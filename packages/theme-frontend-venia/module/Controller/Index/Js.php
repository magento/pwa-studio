<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 * Created by PhpStorm.
 * User: jzetlen
 * Date: 1/25/18
 * Time: 10:14 AM
 */

namespace Magento\Pwa\Controller\Index;

use Magento\Framework\Controller\Result\Raw;
use Magento\Framework\Controller\ResultFactory;

class Js extends \Magento\Framework\App\Action\Action
{
    /** @var \Magento\Pwa\Helper\WebpackConfig $webpackConfig */
    private $webpackConfig;

    /**
     * @var \Magento\Pwa\Model\Result\JsFileResultFactory
     */
    private $jsFileResultFactory;

    /**
     * Index constructor.
     *
     * @param \Magento\Pwa\Helper\WebpackConfig $webpackConfig
     * @param \Magento\Framework\App\Action\Context $context
     * @param \Magento\Pwa\Model\Result\JsFileResultFactory $jsFileResultFactory
     */
    public function __construct(
        \Magento\Pwa\Helper\WebpackConfig $webpackConfig,
        \Magento\Framework\App\Action\Context $context,
        \Magento\Pwa\Model\Result\JsFileResultFactory $jsFileResultFactory
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
        } else {
            /** @var Raw $result */
            $result = $this->resultFactory->create(ResultFactory::TYPE_RAW);
            $result->setHttpResponseCode(404);
            $result->setContents('404: Could not find ' . $this->webpackConfig->getServiceWorkerFileName());
        }
        return $result;
    }

}