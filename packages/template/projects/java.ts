import type { ProjectTemplate } from "../../types";
import files from "./files/_java";

export const JavaSpringBoot: ProjectTemplate = {
    name: "Spring Boot",
    description: "Java Backend with Spring Boot Framework",
    notes: "Java 21 and Maven must be installed in your system.",
    type: "app",
    category: "Project",
    icon: "fas fa-leaf text-green-500",
    templating: [
        {
            action: 'file',
            file: 'pom.xml',
            filecontent: files.pomXml
        },
        {
            action: 'file',
            file: 'src/main/java/com/example/demo/DemoApplication.java',
            filecontent: files.applicationJava
        },
        {
            action: 'file',
            file: 'src/main/java/com/example/demo/HelloController.java',
            filecontent: files.controllerJava
        },
        {
            action: 'file',
            file: 'src/main/resources/static/index.html',
            filecontent: files.indexHtmlFile
        },
        {
            action: 'file',
            file: 'src/main/resources/application.properties',
            filecontent: files.applicationProperties
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['install', '-D', 'nodemon']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.dev=nodemon --watch src --ext java,xml --exec "mvn spring-boot:run"']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.start=mvn spring-boot:run']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.build=mvn clean package']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'description=Spring Boot Application']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.stop=npx kill-port 4500']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-leaf text-green-500']
        }
    ]
};
