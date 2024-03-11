const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'});

const doc = {
  swagger: "2.0",
  info:{
    version: "1.0.0",
    title: "Musicstone API",
    description: "Node.js Swaager swagger-jsdoc 방식 RestFul API 클라이언트 UI",
  },
  host: "localhost:4000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";	// 같은 위치에 swagger-output.json을 만든다.
const endpointsFiles = [ "../routes/index.js" ];

swaggerAutogen(outputFile, endpointsFiles, doc);