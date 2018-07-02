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
use Magento\Framework\Controller\Result\Json;
use Magento\Framework\Controller\ResultFactory;
use Magento\Pwa\Helper\WebpackConfig;

class WebpackConfigEndpoint extends Action
{
    /**
     * @var WebpackConfig $webpackConfig
     */
    private $webpackConfig;

    /**
     * Index constructor.
     *
     * @param WebpackConfig $webpackConfig
     * @param Context $context
     */
    public function __construct(
        WebpackConfig $webpackConfig,
        Context $context
    ) {
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
