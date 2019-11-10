CREATE DATABASE dbo;

USE dbo;


    -- ************************************** `dbo`.`Periodo`

CREATE TABLE `dbo`.`Periodo`
(
 `id`          int NOT NULL AUTO_INCREMENT ,
 `fechaInicio` date NOT NULL ,
 `fechafin`    date NOT NULL ,
 `descripcion` varchar(250) NOT NULL ,

PRIMARY KEY (`id`)
);

-- ************************************** `dbo`.`Pregunta`

CREATE TABLE `dbo`.`Pregunta`
(
 `id`          int NOT NULL AUTO_INCREMENT ,
 `descripcion` varchar(250) NULL ,
 `idPeriodo`   int NOT NULL ,

PRIMARY KEY (`id`),
KEY `fkIdx_17` (`idPeriodo`),
CONSTRAINT `FK_17` FOREIGN KEY `fkIdx_17` (`idPeriodo`) REFERENCES `dbo`.`Periodo` (`id`)
);

-- ************************************** `dbo`.`Respuesta`

CREATE TABLE `dbo`.`Respuesta`
(
 `id`          int NOT NULL AUTO_INCREMENT ,
 `descripcion` varchar(250) NULL ,
 `valor`       decimal(18,2) NULL ,
 `idPregunta`  int NOT NULL ,

PRIMARY KEY (`id`),
KEY `fkIdx_25` (`idPregunta`),
CONSTRAINT `FK_25` FOREIGN KEY `fkIdx_25` (`idPregunta`) REFERENCES `dbo`.`Pregunta` (`id`)
);