CREATE TABLE IF NOT EXISTS `messagestatuslogs` (
  `id` CHAR(36) BINARY NOT NULL,
  `externalId` varchar(255) DEFAULT NULL,
  `externalProvider` varchar(255) NOT NULL,
  `sender` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `reciever` varchar(255) NOT NULL,
  `contents` TEXT NOT NULL,  
  `status` varchar(255) NOT NULL,
  `cause` varchar(255) DEFAULT NULL,
  `deliveredTimeStamp` varchar(255) DEFAULT NULL,
  `originallySentAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;