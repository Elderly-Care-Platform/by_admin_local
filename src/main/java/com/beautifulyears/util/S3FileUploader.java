/**
 * 
 */
package com.beautifulyears.util;

import java.io.File;
import java.io.IOException;

import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.beautifulyears.constants.CDNConstants;

/**
 * @author Nitin
 *
 */
public class S3FileUploader implements Runnable {
	private final static AmazonS3 s3client = new AmazonS3Client(
			new BasicAWSCredentials(CDNConstants.IMAGE_CDN_ACCESS_KEY,
					CDNConstants.IMAGE_CDN_SECRET_KEY));
	private String bucketName;
	private String keyName;
	private File file;

	public S3FileUploader(String bucketName, String keyName, File file) {
		super();
		this.bucketName = bucketName;
		this.keyName = keyName;
		this.file = file;
	}

	public String uploadFile(boolean async) throws AmazonServiceException,
			AmazonClientException, IOException {

		String path = null;
		try {
			System.out
					.println("Uploading a new object to S3 from a file with name "
							+ keyName);
			if(async){
				new Thread(this).start();
			}else{
				this.run();
			}
			
			path = System.getProperty("cdnPath") + "/" + keyName;
		} catch (AmazonServiceException ase) {
			System.out.println("Caught an AmazonServiceException, which "
					+ "means your request made it "
					+ "to Amazon S3, but was rejected with an error response"
					+ " for some reason.");
			System.out.println("Error Message:    " + ase.getMessage());
			System.out.println("HTTP Status Code: " + ase.getStatusCode());
			System.out.println("AWS Error Code:   " + ase.getErrorCode());
			System.out.println("Error Type:       " + ase.getErrorType());
			System.out.println("Request ID:       " + ase.getRequestId());
			throw ase;
		} catch (AmazonClientException ace) {
			System.out.println("Caught an AmazonClientException, which "
					+ "means the client encountered "
					+ "an internal error while trying to "
					+ "communicate with S3, "
					+ "such as not being able to access the network.");
			System.out.println("Error Message: " + ace.getMessage());
			throw ace;
		}

		return path;

	}

	@Override
	public void run() {
		PutObjectRequest newObj = new PutObjectRequest(bucketName, keyName,
				file);
		S3FileUploader.s3client.putObject(newObj
				.withCannedAcl(CannedAccessControlList.PublicRead));
		System.out.println("Finished uploading file with name = " + keyName);
	}

}
