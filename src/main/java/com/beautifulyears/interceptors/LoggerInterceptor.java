package com.beautifulyears.interceptors;

import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

@Service
public class LoggerInterceptor extends HandlerInterceptorAdapter{
	private static final Logger logger = Logger.getLogger(LoggerInterceptor.class);
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
            Object handler) throws Exception {
		StringBuffer requestLog = new StringBuffer();
		requestLog.append("Request URL::");
		requestLog.append(request.getRequestURL().toString());
		requestLog.append(" params ");
		Enumeration<String> params = request.getParameterNames(); 
        while(params.hasMoreElements()){
         String paramName = (String)params.nextElement();
         requestLog.append(paramName+":"+request.getParameter(paramName)+",");
        }
        logger.debug(requestLog);
       return true;
    }
	
	@Override
    public void postHandle(HttpServletRequest request,
            HttpServletResponse response, Object handler,
            ModelAndView modelAndView) throws Exception {
    }
 
    @Override
    public void afterCompletion(HttpServletRequest request,
            HttpServletResponse response, Object handler, Exception ex)
            throws Exception {
    }
}
