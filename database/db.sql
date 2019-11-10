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

INSERT INTO `periodo` (`id`, `fechaInicio`, `fechafin`, `descripcion`) VALUES (NULL, '2019-01-01', '2020-07-31', '2019-01'), (NULL, '2019-08-01', '2019-12-31', '2019-02')

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

-- ************************************** `NivelGobierno`

CREATE TABLE `NivelGobierno`
(
 `descripcion` varchar(50) NULL ,
 `id`          char(3) NOT NULL ,

PRIMARY KEY (`id`)
);

INSERT INTO `nivelgobierno` (`descripcion`, `id`) VALUES ('Regional', 'REG'), ('Distrital', 'DIS'), ('Departamental', 'DEP')

-- ************************************** `Usuario`

CREATE TABLE `Usuario`
(
 `id`            int NOT NULL AUTO_INCREMENT ,
 `nombre`        varchar(50) NULL ,
 `nombreEntidad` varchar(50) NULL ,
 `nivelGobierno` char(3) NOT NULL ,
 `rol`           char(3) NULL ,

PRIMARY KEY (`id`),
KEY `fkIdx_141` (`nivelGobierno`),
CONSTRAINT `FK_141` FOREIGN KEY `fkIdx_141` (`nivelGobierno`) REFERENCES `NivelGobierno` (`id`)
);





