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

use Magento\Framework\Controller\Result\Json;
use Magento\Framework\Controller\ResultFactory;

class WebpackConfigEndpoint extends \Magento\Framework\App\Action\Action
{
    /** @var \Magento\Pwa\Helper\WebpackConfig $webpackConfig */
    private $webpackConfig;

    /**
     * Index constructor.
     *
     * @param \Magento\Pwa\Helper\WebpackConfig $webpackConfig
     * @param \Magento\Framework\App\Action\Context $context
     */
    public function __construct(
        \Magento\Pwa\Helper\WebpackConfig $webpackConfig,
        \Magento\Framework\App\Action\Context $context
    )
    {

        parent::__construct($context);
        $this->webpackConfig = $webpackConfig;
    }


    /**
     * @inheritdoc
     */
    public function execute()
    {
        /** @var Json $result */
        $result = $this->resultFactory->create(ResultFactory::TYPE_JSON);
        $result->setHttpResponseCode(200);
        $result->setData($this->webpackConfig);
        return $result;
    }

}