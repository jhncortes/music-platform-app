<?php
namespace App\Services;

use Aws\Laravel\AwsFacade as AWS;

class S3Service {

    // Gets presigned URL for uploading (PUT) or downloading (GET)
    public function getPresignedUrl($bucket, $key, $expires, $contentType) {
        $s3Client = AWS::createClient('s3');


        $cmd = $s3Client->getCommand('PutObject', [
            'Bucket' => $bucket,
            'Key'    => $key,
            'ContentType' => $contentType
        ]);

        $request = $s3Client->createPresignedRequest($cmd, "+{$expires} minutes");

        return (string) $request->getUri();
    }
}
