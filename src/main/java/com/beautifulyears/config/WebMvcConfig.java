package com.beautifulyears.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.json.MappingJacksonJsonView;

import com.beautifulyears.interceptors.LoggerInterceptor;
import com.beautifulyears.interceptors.SessionInterceptor;
import com.beautifulyears.rest.PingResource;

@EnableWebMvc
@ComponentScan(basePackageClasses = PingResource.class)
@Configuration
public class WebMvcConfig extends WebMvcConfigurerAdapter {
	
	@Autowired
    private LoggerInterceptor loggerInterceptor;
	@Autowired
    private SessionInterceptor sessionInterceptor;

    @Bean
    public MappingJacksonJsonView jsonView() {
        MappingJacksonJsonView jsonView = new MappingJacksonJsonView();
        jsonView.setPrefixJson(true);
        return jsonView;
    }
    
    @Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(loggerInterceptor).addPathPatterns("/**");
		registry.addInterceptor(sessionInterceptor).addPathPatterns("/**");
	}
}
