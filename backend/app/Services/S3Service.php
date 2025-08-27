<?php
namespace App\Services;

use Aws\Laravel\AwsFacade as AWS;

class S3Service {

    // Gets presigned URL for uploading (PUT) or downloading (GET)
    public function getPresignedUrl($bucket, $key, $expires = 60, $method = 'GET') {
        $s3Client = AWS::createClient('s3');

        $commandName = $method === 'PUT' ? 'PutObject' : 'GetObject';

        $cmd = $s3Client->getCommand($commandName, [
            'Bucket' => $bucket,
            'Key'    => $key,
            'ContentType' => 'image/png' // Adjust content type as needed
        ]);

        $request = $s3Client->createPresignedRequest($cmd, "+{$expires} minutes");

        return (string) $request->getUri();
    }
}
