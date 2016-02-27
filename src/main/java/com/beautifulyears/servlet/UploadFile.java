package com.beautifulyears.servlet;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.log4j.Logger;
import org.imgscalr.Scalr;

import com.beautifulyears.constants.BYConstants;
import com.beautifulyears.constants.CDNConstants;
import com.beautifulyears.util.S3FileUploader;

public class UploadFile extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private String uploadDir = BYConstants.IMAGE_CDN_PATH;
	private String s3MediaBucketName;

	private static final int TITLE_IMG_WIDTH = 640;
	private static final int TITLE_IMG_HEIGHT = 650;

	private static final int THUMBNAIL_IMG_WIDTH = 135;
	private static final int THUMBNAIL_IMG_HEIGHT = 168;

	private static final Logger logger = Logger.getLogger(UploadFile.class);

	public void init() {
		System.out.println("CONTEXT PATH ===== "
				+ getServletContext().getContextPath());
		System.out.println(getServletContext().getInitParameter(
				"imageUploadPath"));
		if (null != getServletContext().getInitParameter("cdnPath")) {
			System.setProperty("cdnPath",getServletContext().getInitParameter("cdnPath"));
		}
		if (null != getServletContext().getInitParameter("imageUploadPath")) {
			uploadDir = getServletContext().getInitParameter("imageUploadPath");
		}
		if (null != getServletContext().getInitParameter("s3MediaBucketName")) {
			s3MediaBucketName = getServletContext().getInitParameter("s3MediaBucketName");
		}
		// uploadDir = "/home/ubuntu/uploads";
		// uploadDir = "c:/uploads";

	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.debug("request to upload the file arrived");
		boolean isMultipart = ServletFileUpload.isMultipartContent(request);

		response.setContentType("application/json");
		String origPath = null;
		String thumbnailPath = null;
		String titlePath = null;

		if (isMultipart) {
			logger.debug("request to upload the file arrived ---- multipart is true");
			FileItemFactory factory = new DiskFileItemFactory();
			response.setStatus(200);
			ServletFileUpload upload = new ServletFileUpload(factory);
			try {
				List<FileItem> multiparts = upload.parseRequest(request);
				List<String> resImageArray = new ArrayList<String>();
				StringBuffer resImage = new StringBuffer("");
				for (FileItem item : multiparts) {
					resImage = new StringBuffer("");
					if (!item.isFormField()) {
						UUID fname = UUID.randomUUID();
						String name = new File(item.getName()).getName();
						String extension = name
								.substring(name.lastIndexOf(".") + 1);
						File newFile = File.createTempFile("orig", ".jpg");

						item.write(newFile);
						origPath = (new S3FileUploader(s3MediaBucketName,
								CDNConstants.IMAGE_CDN_ORIG_FOLDER + "/"
										+ fname + "." + extension, newFile))
								.uploadFile(false);

						if (null != request.getParameter("transcoding")
								&& true == Boolean.valueOf(request
										.getParameter("transcoding"))) {
							if (isAnimatedGif(newFile)) {
								File titleImage = File.createTempFile("title",
										".jpg");
								titlePath = (new S3FileUploader(
										s3MediaBucketName,
										CDNConstants.IMAGE_CDN_TITLE_FOLDER
												+ "/" + fname + "." + extension,
										newFile)).uploadFile(false);
								Files.copy(newFile.toPath(),
										titleImage.toPath());

								File thumbnail = File.createTempFile("thumb",
										".jpg");
								thumbnailPath = (new S3FileUploader(
										s3MediaBucketName,
										CDNConstants.IMAGE_CDN_THUMB_FOLDER
												+ "/" + fname + "." + extension,
										newFile)).uploadFile(true);
								Files.copy(newFile.toPath(), thumbnail.toPath());
							} else {
								titlePath = resizeImage(newFile,
										TITLE_IMG_WIDTH, TITLE_IMG_HEIGHT,
										uploadDir,
										CDNConstants.IMAGE_CDN_TITLE_FOLDER
												+ "/" + fname, extension, false);

								thumbnailPath = resizeImage(newFile,
										THUMBNAIL_IMG_WIDTH,
										THUMBNAIL_IMG_HEIGHT, uploadDir,
										CDNConstants.IMAGE_CDN_THUMB_FOLDER
												+ "/" + fname, extension, true);
							}

						}

						if (null != request.getParameter("type")
								&& "editor"
										.equals(request.getParameter("type"))) {
							// res.append("\"original\":");
							resImage.append(origPath);
						} else if (null != request.getParameter("transcoding")
								&& true == Boolean.valueOf(request
										.getParameter("transcoding"))) {
							resImage.append("{");
							resImage.append("\"original\":\"");
							resImage.append(origPath);
							resImage.append("\",");
							resImage.append("\"titleImage\":\"");
							resImage.append(titlePath);
							resImage.append("\",");
							resImage.append("\"thumbnailImage\":\"");
							resImage.append(thumbnailPath);
							resImage.append("\"}");
						}
					}
					resImageArray.add(resImage.toString());
				}
				if (null != request.getParameter("multi")
						&& true == Boolean.valueOf(request
								.getParameter("multi"))) {
					response.getWriter().write(resImageArray.toString());
				} else {
					response.getWriter().write(resImage.toString());
				}

			} catch (Exception e) {
				e.printStackTrace();
				logger.error("upload upload failes");
				System.out.println("File upload failed");
			}
		}
	}

	private boolean isAnimatedGif(File f) {
		ImageReader is = ImageIO.getImageReadersBySuffix("GIF").next();
		ImageInputStream iis;
		boolean isAnimatedGif = false;
		try {
			iis = ImageIO.createImageInputStream(f);
			is.setInput(iis);
			int images = is.getNumImages(true);
			if (images > 1) {
				isAnimatedGif = true;
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return isAnimatedGif;
	}

	private String resizeImage(File newFile, int width, int height,
			String uploadDir, String fname, String extension, boolean async)
			throws IOException {

		String path = null;

		BufferedImage image = ImageIO.read(newFile);
		int imageWidth = image.getWidth(null);
		int imageHeight = image.getHeight(null);
		int newHeight = 0;
		int newWidth = 0;

		double aspectRatio = (double) imageWidth / (double) imageHeight;
		if (imageWidth > width && imageHeight > height) {
			// both height and width are bigger
			if ((imageWidth - width) > (imageHeight - height)) {
				newWidth = width;
				newHeight = (int) (height / aspectRatio);
			} else {
				newHeight = height;
				newWidth = (int) (height * aspectRatio);
			}
		} else if (imageWidth > width) {
			// only width is bigger
			newWidth = width;
			newHeight = (int) (height / aspectRatio);
		} else if (imageHeight > height) {
			// only height is bigger
			newHeight = height;
			newWidth = (int) (width * aspectRatio);
		} else {
			// both are smaller then max
			newHeight = 0;
			newWidth = 0;
		}
		if (newHeight != 0 && newWidth != 0) {
			BufferedImage thumbnail = Scalr.resize(image,
					Scalr.Method.ULTRA_QUALITY, Scalr.Mode.FIT_TO_WIDTH,
					newWidth, newHeight, Scalr.OP_ANTIALIAS);
			File f = File.createTempFile(fname, ".jpg");
			ImageIO.write(thumbnail, extension, f);
			path = (new S3FileUploader(s3MediaBucketName, fname + "_" + width
					+ "_" + height + "." + extension, f)).uploadFile(async);

		} else {
			BufferedImage thumbnail = Scalr.resize(image,
					Scalr.Method.ULTRA_QUALITY, Scalr.Mode.FIT_TO_WIDTH, imageWidth,
					imageHeight, Scalr.OP_ANTIALIAS);
			File f = File.createTempFile(fname, ".jpg");
			ImageIO.write(thumbnail, extension, f);
			path = (new S3FileUploader(s3MediaBucketName, fname + "_" + width
					+ "_" + height + "." + extension, f)).uploadFile(async);
		}
		return path;

	}


}