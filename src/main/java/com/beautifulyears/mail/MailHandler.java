/**
 * 
 */
package com.beautifulyears.mail;

import java.util.List;
import java.util.Properties;

import javax.mail.Address;
import javax.mail.Message;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.apache.log4j.Logger;

import com.beautifulyears.config.GetByWebApplicationInitializer;
import com.beautifulyears.constants.BYConstants;
import com.beautifulyears.domain.User;
import com.beautifulyears.exceptions.BYErrorCodes;
import com.beautifulyears.exceptions.BYException;
import com.beautifulyears.rest.UserController;
import com.beautifulyears.util.Util;

/**
 * @author Nitin
 *
 */
public class MailHandler {
	private final static Logger logger = Logger.getLogger(MailHandler.class);
	private static final String user = "support@beautifulyears.com";
	private static final String pass = "BY2015@)!%";
	private static final String SMTP = "smtp.gmail.com";
	private static final String SMTP_PORT = "587";
	private static final String FROM = "support@beautifulyears.com";

	private static class MailDispatcher implements Runnable {
		private String to;
		private String subject;
		private String body;
		private final Logger logger = Logger.getLogger(MailDispatcher.class);

		public MailDispatcher(String to, String subject, String body) {
			this.to = to;
			this.subject = subject;
			this.body = body;
		}

		@Override
		public void run() {
			Properties props = new Properties();
			props.put("mail.smtp.host", SMTP);
			props.put("mail.smtp.port", SMTP_PORT);
			props.put("mail.smtp.auth", "true");
			props.put("mail.smtp.starttls.enable", "true");
			Session session = Session.getInstance(props,
					new javax.mail.Authenticator() {
						protected PasswordAuthentication getPasswordAuthentication() {
							return new PasswordAuthentication(user, pass);
						}
					});

			try {
				logger.debug("mail request for "+to+" with subject "+subject+" arrived");
				MimeMessage message = new MimeMessage(session);
				message.setFrom(new InternetAddress(FROM));
				message.setReplyTo(new Address [] {new InternetAddress(FROM)});
				message.addRecipient(Message.RecipientType.TO,
						new InternetAddress(to));
				message.setSubject(subject);
				message.setContent(body, "text/html");
				Transport.send(message);
				logger.debug("email sent successfully to "+to);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

	}

	public static void sendMail(String to, String subject, String body) {
		//if(!Util.isEmpty(GetByWebApplicationInitializer.servletContext.getInitParameter("mail"))){
			new Thread(new MailDispatcher(to, subject, body)).start();
		//}else{
			//logger.debug("not sending mail as it is disabled in context config");
			//throw new BYException(BYErrorCodes.ERROR_IN_SENDING_MAIL);
		//}
		
	}
	
	public static void sendMultipleMail(List<String> to, String subject, String body) {
		//if(!Util.isEmpty(GetByWebApplicationInitializer.servletContext.getInitParameter("mail"))){
			for(String email: to){
				new Thread(new MailDispatcher(email, subject, body)).start();
			}
			
		//}else{
			//logger.debug("not sending mail as it is disabled in context config");
			//throw new BYException(BYErrorCodes.ERROR_IN_SENDING_MAIL);
		//}
		
	}
	
	public static void sendMailToUserId(String userId, String subject, String body) {
		User user = UserController.getUsers(userId);
		if(null != user && user.getRegType() == BYConstants.REGISTRATION_TYPE_EMAIL){
			sendMail(user.getEmail(), subject, body);
		}
		
	}
	
	public static void shareInMail(List<String> email, String subject, String body) {
		sendMultipleMail(email, subject, body);		
	}
}
