package com.beautifulyears.servlet;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.log4j.Logger;

import com.beautifulyears.BYConstants;

public class UploadFile extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private String uploadDir = BYConstants.IMAGE_CDN_PATH;

	private static final int TITLE_IMG_WIDTH = 640;
	private static final int TITLE_IMG_HEIGHT = 650;

	private static final int THUMBNAIL_IMG_WIDTH = 135;
	private static final int THUMBNAIL_IMG_HEIGHT = 168;

	private static final Logger logger = Logger.getLogger(UploadFile.class);

	public void init() {
		System.out.println("CONTEXT PATH ===== "
				+ getServletContext().getContextPath());
		// uploadDir = "/home/ubuntu/uploads";
//		uploadDir = "c:/uploads";

	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.debug("request to upload the file arrived");
		boolean isMultipart = ServletFileUpload.isMultipartContent(request);

		response.setContentType("application/json");

		if (isMultipart) {
			logger.debug("request to upload the file arrived ---- multipart is true");
			FileItemFactory factory = new DiskFileItemFactory();
			response.setStatus(200);
			ServletFileUpload upload = new ServletFileUpload(factory);
			try {
				List<FileItem> multiparts = upload.parseRequest(request);
				for (FileItem item : multiparts) {
					if (!item.isFormField()) {
						UUID fname = UUID.randomUUID();
						String name = new File(item.getName()).getName();
						String extension = name
								.substring(name.lastIndexOf(".") + 1);
						File newFile = new File(uploadDir + File.separator
								+ fname + "." + extension);

						item.write(newFile);

						if (null != request.getParameter("transcoding")
								&& true == Boolean.valueOf(request
										.getParameter("transcoding"))) {
							BufferedImage resizeImageJpg = resizeImage(newFile,
									TITLE_IMG_WIDTH, TITLE_IMG_HEIGHT);
							ImageIO.write(resizeImageJpg, "jpg", new File(
									uploadDir + File.separator + fname + "_"
											+ TITLE_IMG_WIDTH + "_"
											+ TITLE_IMG_HEIGHT + "."
											+ extension));
							resizeImageJpg = resizeImage(newFile,
									THUMBNAIL_IMG_WIDTH, THUMBNAIL_IMG_HEIGHT);

							ImageIO.write(resizeImageJpg, "jpg", new File(
									uploadDir + File.separator + fname + "_"
											+ THUMBNAIL_IMG_WIDTH + "_"
											+ THUMBNAIL_IMG_HEIGHT + "."
											+ extension));
						}

						StringBuffer res = new StringBuffer("");
						if(null != request.getParameter("type")
								&& "editor".equals(request.getParameter("type"))){
//							res.append("\"original\":");
							res.append("/uploaded_files/" + fname + "."
									+ extension);
						}else if (null != request.getParameter("transcoding")
								&& true == Boolean.valueOf(request
										.getParameter("transcoding"))) {
							res.append("{");
							res.append("\"original\":");
							res.append("\"/uploaded_files/" + fname + "."
									+ extension);
							res.append("\",");
							res.append("\"titleImage\":");
							res.append("\"/uploaded_files/" + fname + "_"
									+ TITLE_IMG_WIDTH + "_" + TITLE_IMG_HEIGHT
									+ "." + extension + "\",");
							res.append("\"thumbnailImage\":");
							res.append("\"/uploaded_files/" + fname + "_"
									+ THUMBNAIL_IMG_WIDTH + "_"
									+ THUMBNAIL_IMG_HEIGHT + "." + extension
									+ "\"");
							res.append("}");
						}

						
						response.getWriter().write(res.toString());
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
				logger.error("upload upload failes");
				System.out.println("File upload failed");
			}
		}
	}

	private static BufferedImage resizeImage(File originalImage, int maxWidth,
			int maxHeight) throws IOException {
		BufferedImage image = ImageIO.read(originalImage);
		int imageWidth = image.getWidth(null);
		int imageHeight = image.getHeight(null);
		int newHeight = maxHeight < imageHeight ? maxHeight : imageHeight;
		int newWidth = maxWidth < imageWidth ? maxWidth : imageWidth;
		double thumbRatio = (double) maxWidth / (double) maxHeight;

		double aspectRatio = (double) imageWidth / (double) imageHeight;

		if (thumbRatio < aspectRatio) {
			newHeight = (int) (maxWidth / aspectRatio);
		} else {
			newWidth = (int) (maxHeight * aspectRatio);
		}

		BufferedImage resizedImage = new BufferedImage(newWidth, newHeight,
				BufferedImage.TYPE_INT_RGB);
		Graphics2D g = resizedImage.createGraphics();
		
		g.drawImage(image, 0, 0, newWidth, newHeight, null);

		g.dispose();

		return resizedImage;
	}

}