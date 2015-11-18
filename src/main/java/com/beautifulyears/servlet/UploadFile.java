package com.beautifulyears.servlet;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.coobird.thumbnailator.Thumbnails;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.log4j.Logger;

import com.beautifulyears.constants.BYConstants;

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
		System.out.println(getServletContext().getInitParameter(
				"imageUploadPath"));
		if (null != getServletContext().getInitParameter("imageUploadPath")) {
			uploadDir = getServletContext().getInitParameter("imageUploadPath");
		}
		// uploadDir = "/home/ubuntu/uploads";
		uploadDir = "c:/uploads";

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
				List<String> resImageArray = new ArrayList<String>();
				StringBuffer resImage = new StringBuffer("");
				for (FileItem item : multiparts) {
					resImage = new StringBuffer("");
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
							resizeImage(newFile, TITLE_IMG_WIDTH,
									TITLE_IMG_HEIGHT, uploadDir, fname,
									extension);

							// BufferedImage resizeImageJpg =
							// resizeImage(newFile,
							// TITLE_IMG_WIDTH, TITLE_IMG_HEIGHT);
							// ImageIO.write(resizeImageJpg, "jpg", new File(
							// uploadDir + File.separator + fname + "_"
							// + TITLE_IMG_WIDTH + "_"
							// + TITLE_IMG_HEIGHT + "."
							// + extension));
							// resizeImageJpg = resizeImage(newFile,
							// THUMBNAIL_IMG_WIDTH, THUMBNAIL_IMG_HEIGHT);
							//
							// ImageIO.write(resizeImageJpg, "jpg", new File(
							// uploadDir + File.separator + fname + "_"
							// + THUMBNAIL_IMG_WIDTH + "_"
							// + THUMBNAIL_IMG_HEIGHT + "."
							// + extension));
							resizeImage(newFile, THUMBNAIL_IMG_WIDTH,
									THUMBNAIL_IMG_HEIGHT, uploadDir, fname,
									extension);
						}

						if (null != request.getParameter("type")
								&& "editor"
										.equals(request.getParameter("type"))) {
							// res.append("\"original\":");
							resImage.append("/uploaded_files/" + fname + "."
									+ extension);
						} else if (null != request.getParameter("transcoding")
								&& true == Boolean.valueOf(request
										.getParameter("transcoding"))) {
							resImage.append("{");
							resImage.append("\"original\":");
							resImage.append("\"/uploaded_files/" + fname + "."
									+ extension);
							resImage.append("\",");
							resImage.append("\"titleImage\":");
							resImage.append("\"/uploaded_files/" + fname + "_"
									+ TITLE_IMG_WIDTH + "_" + TITLE_IMG_HEIGHT
									+ "." + extension + "\",");
							resImage.append("\"thumbnailImage\":");
							resImage.append("\"/uploaded_files/" + fname + "_"
									+ THUMBNAIL_IMG_WIDTH + "_"
									+ THUMBNAIL_IMG_HEIGHT + "." + extension
									+ "\"");
							resImage.append("}");
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

	private void resizeImage(File newFile, int width, int height,
			String uploadDir, UUID fname, String extension) throws IOException {

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
			Thumbnails
			.of(newFile)
			.size(newWidth, newHeight)
			.toFile(uploadDir + File.separator + fname + "_" + width + "_"
					+ height + "." + extension);
		}else{
			ImageIO.write(image, "jpg", new File(
					 uploadDir + File.separator + fname + "_" + width + "_"
								+ height + "." + extension));
		}
		
	}

	// private static BufferedImage resizeImage(File originalImage, int
	// maxWidth,
	// int maxHeight) throws IOException {
	// BufferedImage image = ImageIO.read(originalImage);
	// int imageWidth = image.getWidth(null);
	// int imageHeight = image.getHeight(null);
	// int newHeight = 0;
	// int newWidth = 0;
	//
	// double aspectRatio = (double) imageWidth / (double) imageHeight;
	// if (imageWidth > maxWidth && imageHeight > maxHeight) {
	// // both height and width are bigger
	// if ((imageWidth - maxWidth) > (imageHeight - maxHeight)) {
	// newWidth = maxWidth;
	// newHeight = (int) (maxHeight / aspectRatio);
	// } else {
	// newHeight = maxHeight;
	// newWidth = (int) (maxHeight * aspectRatio);
	// }
	// } else if (imageWidth > maxWidth) {
	// // only width is bigger
	// newWidth = maxWidth;
	// newHeight = (int) (maxHeight / aspectRatio);
	// } else if (imageHeight > maxHeight) {
	// // only height is bigger
	// newHeight = maxHeight;
	// newWidth = (int) (maxWidth * aspectRatio);
	// } else {
	// // both are smaller then max
	// newHeight = 0;
	// newWidth = 0;
	// }
	//
	// BufferedImage resizedImage = image;
	// // if (newHeight != 0 && newWidth != 0) {
	// // resizedImage = new BufferedImage(newWidth, newHeight,
	// // BufferedImage.TYPE_INT_RGB);
	// // Graphics2D g = resizedImage.createGraphics();
	// // image = blurImage(image);
	// // g.drawImage(image, 0, 0, newWidth, newHeight, null);
	// //
	// // g.dispose();
	// // }
	//
	// boolean higherQuality = true;
	//
	// int w, h;
	// if (higherQuality) {
	// // Use multi-step technique: start with original size, then
	// // scale down in multiple passes with drawImage()
	// // until the target size is reached
	// w = image.getWidth();
	// h = image.getHeight();
	// } else {
	// // Use one-step technique: scale directly from original
	// // size to target size with a single drawImage() call
	// w = newWidth;
	// h = newHeight;
	// }
	//
	// do {
	// if (w > newWidth) {
	// w /= 2;
	// if (w < newWidth) {
	// w = newWidth;
	// }
	// }
	//
	// if (h > newHeight) {
	// h /= 2;
	// if (h < newHeight) {
	// h = newHeight;
	// }
	// }
	//
	// BufferedImage tmp = new BufferedImage(w, h,
	// BufferedImage.TYPE_INT_RGB);
	// Graphics2D g2 = tmp.createGraphics();
	// g2.drawImage(resizedImage, 0, 0, w, h, null);
	// g2.dispose();
	//
	// resizedImage = tmp;
	// } while (w != newWidth || h != newHeight);
	//
	// return resizedImage;
	// }
	//
	// public static BufferedImage blurImage(BufferedImage image) {
	// float ninth = 1.0f / 9.0f;
	// float[] blurKernel = { ninth, ninth, ninth, ninth, ninth, ninth, ninth,
	// ninth, ninth };
	//
	// Map<Key, Object> map = new HashMap<Key, Object>();
	//
	// map.put(RenderingHints.KEY_INTERPOLATION,
	// RenderingHints.VALUE_INTERPOLATION_BILINEAR);
	//
	// map.put(RenderingHints.KEY_RENDERING,
	// RenderingHints.VALUE_RENDER_QUALITY);
	// map.put(RenderingHints.KEY_ANTIALIASING,
	// RenderingHints.VALUE_ANTIALIAS_ON);
	//
	// RenderingHints hints = new RenderingHints(map);
	// BufferedImageOp op = new ConvolveOp(new Kernel(3, 3, blurKernel),
	// ConvolveOp.EDGE_NO_OP, hints);
	// return op.filter(image, null);
	// }

}