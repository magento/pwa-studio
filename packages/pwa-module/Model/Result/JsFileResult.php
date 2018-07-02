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
use Magento\Framework\Filesystem\Io\File;

/**
 * A possible implementation of JSON response type (instead of hardcoding json_encode() all over the place)
 * Actual for controller actions that serve ajax requests
 *
 * @api
 */
class JsFileResult extends AbstractResult
{
    /**
     * @var File $file
     */
    private $file;

    /**
     * @var string $contents
     */
    private $contents;

    /**
     * @var integer $contentLength
     */
    private $contentLength;

    /**
     * JsFileResult constructor.
     * @param File $file
     */
    public function __construct(
        File $file
    ) {
        $this->file = $file;
    }

    /**
     * Serve this file from disk.
     *
     * @param string $path
     */
    public function sendJSFile($path)
    {
        $this->contents = $this->file->read($path);
        $this->contentLength = filesize($path);
    }

    /**
     * {@inheritdoc}
     */
    protected function render(HttpResponseInterface $response)
    {
        $response->setHeader('Content-Type', 'application/json', true)
            ->setHeader('Cache-Control', 'must-revalidate, post-check=0, pre-check=0', true)
            ->setHeader('Pragma', 'public', true)
            ->setHeader('Content-Type', 'application/javascript', true)
            ->setHeader('Content-Length', $this->contentLength)
            ->setBody($this->contents);
        return $this;
    }
}
