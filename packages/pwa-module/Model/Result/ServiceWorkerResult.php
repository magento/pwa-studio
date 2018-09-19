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

namespace Magento\Pwa\Model\Result;

use Magento\Framework\App\Response\HttpInterface as HttpResponseInterface;
use Magento\Framework\Controller\AbstractResult;

/**
 * @api
 */
class ServiceWorkerResult extends AbstractResult
{
    public const SERVICE_WORKER_FILENAME = 'sw.js';

    /**
     * @var string $contents
     */
    private $contents;

    /**
     * Serve the SW content JS.
     *
     * @param string $contents
     */
    public function sendServiceWorker($contents)
    {
        $this->contents = $contents;
    }

    /**
     * {@inheritdoc}
     */
    protected function render(HttpResponseInterface $response)
    {
        $response->setHeader('Cache-Control', 'must-revalidate, post-check=0, pre-check=0', true)
            ->setHeader('Pragma', 'public', true)
            ->setHeader('Content-Type', 'application/javascript', true)
            ->setHeader('Content-Length', strlen($this->contents), true)
            ->setBody($this->contents);
        return $this;
    }
}
