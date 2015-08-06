/**
 * Jun 27, 2015
 * Nitin
 * 2:59:29 PM
 */
package com.beautifulyears.util;

import org.apache.log4j.Logger;

public class LoggerUtil {
	private static final Logger logger = Logger.getLogger(LoggerUtil.class);
	public static void logEntry(){
		try{
			StackTraceElement currentStack = Thread.currentThread().getStackTrace()[2];
			if(null != currentStack){
				logger.trace("ENTERING "+currentStack.getClassName() + "::" + currentStack.getMethodName());
			}
		}catch(Exception e){
			
		}
	}
	
	public static void logExit(){
		try{
			StackTraceElement currentStack = Thread.currentThread().getStackTrace()[2];
			if(null != currentStack){
				logger.trace("ENTERING "+currentStack.getClassName() + "::" + currentStack.getMethodName());
			}
		}catch(Exception e){
			
		}
	}
}
