<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 * Created by PhpStorm.
 */

namespace Magento\Pwa\Block;

use Magento\Pwa\Helper\WebpackConfig;

class Bundle extends \Magento\Backend\Block\AbstractBlock
{
    /**
     * @var \Magento\Framework\App\State
     */
    private $state;
    /**
     * @var WebpackConfig
     */
    private $webpackConfig;

    /**
     * @override
     * @see \Magento\Backend\Block\AbstractBlock::_construct()
     * @param \Magento\Backend\Block\Context $context
     * @param array $data
     * @param \Magento\Framework\App\State $state
     * @param WebpackConfig $webpackConfig
     */

    public function __construct(
        \Magento\Backend\Block\Context $context,
        array $data = [],
        \Magento\Framework\App\State $state,
        WebpackConfig $webpackConfig
    )
    {
        parent::__construct($context, $data);
        $this->webpackConfig = $webpackConfig;
        $this->state = $state;

//        $om = \Magento\Framework\App\ObjectManager::getInstance();
//        $mode = \Magento\Framework\App\ObjectManager::getInstance()->create(\Magento\Framework\App\State::class)->getMode();
//        $page = $om->get('Magento\Framework\View\Page\Config');
//
//        if ($mode == 'production') {
//            $page->addPageAsset('bundles/vendor.js');
//            $page->addPageAsset('bundles/client.js');
//        }

    }

    public function getMode()
    {
        return $this->state->getMode();
    }

    public function getBundleUrl()
    {
        $mode = $this->getMode();
        if ($mode == "development") {
            return $this->webpackConfig->getDevServerHost() . $this->webpackConfig->getPublicAssetPath() . "client.js";
        }
        return "";
    }
}