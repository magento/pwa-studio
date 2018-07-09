<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 * Created by PhpStorm.
 */
declare(strict_types=1);

namespace Magento\Pwa\Block;

use Magento\Backend\Block\AbstractBlock;
use Magento\Backend\Block\Context;
use Magento\Framework\App\State;
use Magento\Pwa\Helper\WebpackConfig;

/**
 * Class Bundle
 * @package Magento\Pwa\Block
 */
class Bundle extends AbstractBlock
{
    /**
     * @var State
     */
    private $state;

    /**
     * @var WebpackConfig
     */
    private $webpackConfig;

    /**
     * @override
     * @see \Magento\Backend\Block\AbstractBlock::_construct()
     * @param Context $context
     * @param array $data
     * @param State $state
     * @param WebpackConfig $webpackConfig
     */
    public function __construct(
        Context $context,
        array $data = [],
        State $state,
        WebpackConfig $webpackConfig
    ) {
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

    /**
     * @return string
     */
    public function getMode(): string
    {
        return $this->state->getMode();
    }

    /**
     * @return string
     */
    public function getBundleUrl(): string
    {
        $mode = $this->getMode();
        if ($mode === 'development') {
            return $this->webpackConfig->getDevServerHost() . $this->webpackConfig->getPublicAssetPath() . 'client.js';
        }

        return '';
    }
}
