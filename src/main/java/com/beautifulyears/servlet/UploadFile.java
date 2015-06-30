package com.beautifulyears.servlet;

import java.awt.AlphaComposite;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
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

public class UploadFile extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private String uploadDir = "";
	private static final Logger logger = Logger.getLogger(UploadFile.class);

	private static final int IMG_WIDTH = 100;
	private static final int IMG_HEIGHT = 100;

	public void init() {
		System.out.println("Inside INIT of File Upload Servlet");
		System.out.println("CONTEXT PATH ===== "
				+ getServletContext().getContextPath());
		uploadDir = "/home/ubuntu/uploads";

	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		System.out.println("Inside do post of file upload servlet");
		logger.debug("request to upload the file arrived");
		boolean isMultipart = ServletFileUpload.isMultipartContent(request);
		// process only if its multipart content
		if (isMultipart) {
			logger.debug("request to upload the file arrived ---- multipart is true");
			System.out.println("Inside isMultipart");
			// Create a factory for disk-based file items
			FileItemFactory factory = new DiskFileItemFactory();
			response.setStatus(200);
			// Create a new file upload handler
			ServletFileUpload upload = new ServletFileUpload(factory);
			try {
				// Parse the request
				List<FileItem> multiparts = upload.parseRequest(request);
				PrintWriter out = response.getWriter();
				for (FileItem item : multiparts) {
					if (!item.isFormField()) {
						// Generating unique UUID
						UUID fname = UUID.randomUUID();
						String name = new File(item.getName()).getName();
						String extension = name
								.substring(name.lastIndexOf(".") + 1);
						item.write(new File(uploadDir + File.separator + fname
								+ "." + extension));
						logger.debug("upload finishedvwith file name ---- "
								+ "/uploaded_files/" + fname + "." + extension);
//						BufferedImage originalImage = ImageIO.read(new File(
//								uploadDir + File.separator + fname + "."
//										+ extension));
//						int type = originalImage.getType() == 0 ? BufferedImage.TYPE_INT_ARGB
//								: originalImage.getType();

//						BufferedImage resizeImageJpg = resizeImage(
//								originalImage, type);
//						ImageIO.write(resizeImageJpg, "jpg", new File(uploadDir
//								+ File.separator + fname + "_resized" + "."
//								+ extension));
						out.println("/uploaded_files/" + fname + "."
								+ extension);
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
				logger.error("upload upload failes");
				System.out.println("File upload failed");
				throw new ServletException();
			}
		}
	}

	private static BufferedImage resizeImage(BufferedImage originalImage,
			int type) {
		BufferedImage resizedImage = new BufferedImage(IMG_WIDTH, IMG_HEIGHT,
				type);
		Graphics2D g = resizedImage.createGraphics();
		g.drawImage(originalImage, 0, 0, IMG_WIDTH, IMG_HEIGHT, null);
		g.dispose();

		return resizedImage;
	}

	private static BufferedImage resizeImageWithHint(
			BufferedImage originalImage, int type) {

		BufferedImage resizedImage = new BufferedImage(IMG_WIDTH, IMG_HEIGHT,
				type);
		Graphics2D g = resizedImage.createGraphics();
		g.drawImage(originalImage, 0, 0, IMG_WIDTH, IMG_HEIGHT, null);
		g.dispose();
		g.setComposite(AlphaComposite.Src);

		g.setRenderingHint(RenderingHints.KEY_INTERPOLATION,
				RenderingHints.VALUE_INTERPOLATION_BILINEAR);
		g.setRenderingHint(RenderingHints.KEY_RENDERING,
				RenderingHints.VALUE_RENDER_QUALITY);
		g.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
				RenderingHints.VALUE_ANTIALIAS_ON);

		return resizedImage;
	}
}