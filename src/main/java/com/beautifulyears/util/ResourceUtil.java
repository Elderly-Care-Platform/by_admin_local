/**
 * 
 */
package com.beautifulyears.util;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * @author Nitin
 *
 */
public class ResourceUtil {
	private InputStream inputStream = null;
	private String propertyFile = "";

	public ResourceUtil(String propFileName) {
		super();
		propertyFile = propFileName;
		inputStream = getClass().getClassLoader().getResourceAsStream(
				propFileName);
	}

	public String getResource(String propertyName) {
		Properties prop = new Properties();
		try {
			if (inputStream != null) {
				prop.load(inputStream);
			} else {
				throw new FileNotFoundException("property file '"
						+ propertyFile + "' not found in the classpath");
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return prop.getProperty(propertyName);
	}
}
