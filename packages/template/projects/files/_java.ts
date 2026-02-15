export const pomXml = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>3.2.2</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	<groupId>com.example</groupId>
	<artifactId>demo</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>demo</name>
	<description>Demo project for Spring Boot</description>
	<properties>
		<java.version>21</java.version>
	</properties>
	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
	</dependencies>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
	</build>

</project>
`;

export const applicationJava = `package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
						.allowedOrigins("*")
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
						.allowedHeaders("*");
			}
		};
	}
}
`;

export const controllerJava = `package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "hello world";
    }
}
`;

export const indexHtmlFile = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spring Boot Backend</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap');
        body { font-family: 'Outfit', sans-serif; }
        .glass {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
    </style>
</head>
<body class="bg-[#0c0c1d] text-gray-200 min-h-screen flex items-center justify-center relative overflow-hidden">
    <!-- Background Decor -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[100px]"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
    </div>

    <!-- Main Content -->
    <div class="z-10 w-full max-w-2xl px-4">
        <div class="glass rounded-2xl p-8 md:p-12 shadow-2xl border border-white/5 transform transition-all hover:scale-[1.01]">
            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center space-x-3">
                    <span class="text-4xl">🍃</span>
                    <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
                        welcome to Spring Boot
                    </h1>
                </div>
                <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span class="text-xs font-mono text-green-400 uppercase tracking-widest">Running</span>
                </div>
            </div>

            <div class="space-y-6">
                <p class="text-xl text-gray-300 leading-relaxed font-light">
                    Your Java backend is powered by Spring Boot and ready to serve.
                </p>
                
                <div class="p-4 rounded-lg bg-black/30 border border-white/10 font-mono text-sm text-gray-400">
                    <p>$ ./mvnw spring-boot:run</p>
                    <p class="text-green-400">>> JVM started at http://localhost:4500</p>
                </div>

                <div class="pt-4 flex flex-col sm:flex-row gap-4">
                    <a href="/hello" class="group relative px-8 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-bold text-white transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] overflow-hidden">
                        <span class="relative z-10 flex items-center justify-center gap-2">
                            Hello Endpoint
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                    </a>
                    
                    <a href="https://spring.io/projects/spring-boot" target="_blank" class="px-8 py-3 bg-transparent border border-white/20 hover:bg-white/5 rounded-lg font-bold text-gray-300 transition-colors text-center">
                        Spring Docs
                    </a>
                </div>
            </div>
        </div>
        
        <div class="mt-8 text-center text-sm text-gray-500">
            <p>Powered by Spring Boot & Tailwind CSS</p>
        </div>
    </div>
</body>
</html>
`;

export const applicationProperties = `server.port=4500
`;

export default {
    pomXml,
    applicationJava,
    controllerJava,
    indexHtmlFile,
    applicationProperties
};
