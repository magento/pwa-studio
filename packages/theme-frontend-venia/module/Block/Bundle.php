<?php
namespace Magento\Pwa\Block;
class Bundle extends \Magento\Backend\Block\AbstractBlock {
    /**
     * @override
     * @see \Magento\Backend\Block\AbstractBlock::_construct()
     * @return void
     */
    protected function _construct() {
        $om = \Magento\Framework\App\ObjectManager::getInstance();
        $mode = \Magento\Framework\App\ObjectManager::getInstance()->create(\Magento\Framework\App\State::class)->getMode();
        $page = $om->get('Magento\Framework\View\Page\Config');

        if ($mode == 'production') {
            $page->addPageAsset('bundles/vendor.js');
            $page->addPageAsset('bundles/client.js');
        }

    }
}