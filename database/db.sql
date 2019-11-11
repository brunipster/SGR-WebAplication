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
 `password`      varchar(500) NOT NULL ,
 `usuario`       varchar(50) NOT NULL ,

PRIMARY KEY (`id`),
KEY `fkIdx_141` (`nivelGobierno`),
CONSTRAINT `FK_141` FOREIGN KEY `fkIdx_141` (`nivelGobierno`) REFERENCES `NivelGobierno` (`id`)
);

-- ************************************** `dbo`.`Cuestionario`

CREATE TABLE `dbo`.`Cuestionario`
(
 `id`            int NOT NULL AUTO_INCREMENT ,
 `descripcion`   varchar(50) NULL ,
 `estado`        tinyint NOT NULL ,
 `idPeriodo`     int NOT NULL ,
 `nivelGobierno` char(3) NOT NULL ,

PRIMARY KEY (`id`),
KEY `fkIdx_135` (`nivelGobierno`),
CONSTRAINT `FK_135` FOREIGN KEY `fkIdx_135` (`nivelGobierno`) REFERENCES `NivelGobierno` (`id`),
KEY `fkIdx_34` (`idPeriodo`),
CONSTRAINT `FK_34` FOREIGN KEY `fkIdx_34` (`idPeriodo`) REFERENCES `dbo`.`Periodo` (`id`)
);

-- ************************************** `dbo`.`Preguntas_Cuestionario`

CREATE TABLE `dbo`.`Preguntas_Cuestionario`
(
 `id`             int NOT NULL AUTO_INCREMENT ,
 `idPregunta`     int NOT NULL ,
 `idCuestionario` int NOT NULL ,
 `valor`          decimal(18,3) NOT NULL ,

PRIMARY KEY (`id`),
KEY `fkIdx_43` (`idPregunta`),
CONSTRAINT `FK_43` FOREIGN KEY `fkIdx_43` (`idPregunta`) REFERENCES `dbo`.`Pregunta` (`id`),
KEY `fkIdx_49` (`idCuestionario`),
CONSTRAINT `FK_49` FOREIGN KEY `fkIdx_49` (`idCuestionario`) REFERENCES `dbo`.`Cuestionario` (`id`)
);

-- ************************************** `dbo`.`Usuario_Cuestionario`

CREATE TABLE `dbo`.`Usuario_Cuestionario`
(
 `id`             int NOT NULL AUTO_INCREMENT ,
 `estado`         tinyint NOT NULL ,
 `descripcion`    varchar(50) NOT NULL ,
 `idCuestionario` int NOT NULL ,
 `idUsuario`      int NOT NULL ,

PRIMARY KEY (`id`),
KEY `fkIdx_128` (`idUsuario`),
CONSTRAINT `FK_128` FOREIGN KEY `fkIdx_128` (`idUsuario`) REFERENCES `Usuario` (`id`),
KEY `fkIdx_81` (`idCuestionario`),
CONSTRAINT `FK_81` FOREIGN KEY `fkIdx_81` (`idCuestionario`) REFERENCES `dbo`.`Cuestionario` (`id`)
);

-- ************************************** `dbo`.`Preguntas_Resueltas`

CREATE TABLE `dbo`.`Preguntas_Resueltas`
(
 `id`                     int NOT NULL AUTO_INCREMENT ,
 `respuestaDetalle`       varchar(50) NULL ,
 `idUsuarioCuestionario`  int NOT NULL ,
 `idPreguntaCuestionario` int NOT NULL ,
 `preguntaDetalle`        varchar(50) NULL ,

PRIMARY KEY (`id`),
KEY `fkIdx_89` (`idUsuarioCuestionario`),
CONSTRAINT `FK_89` FOREIGN KEY `fkIdx_89` (`idUsuarioCuestionario`) REFERENCES `dbo`.`Usuario_Cuestionario` (`id`),
KEY `fkIdx_92` (`idPreguntaCuestionario`),
CONSTRAINT `FK_92` FOREIGN KEY `fkIdx_92` (`idPreguntaCuestionario`) REFERENCES `dbo`.`Preguntas_Cuestionario` (`id`)
);