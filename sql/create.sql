CREATE TABLE Renter(
   renterID INT,
   renterName VARCHAR(100) NOT NULL,
   address VARCHAR(500) NOT NULL,
   description VARCHAR(1000) NOT NULL,
   inaugurationDate DATE NOT NULL,
   closureDate DATE,
   PRIMARY KEY(renterID)
);

CREATE TABLE Profile(
   profileID INT,
   firstName VARCHAR(100) NOT NULL,
   lastName VARCHAR(100) NOT NULL,
   login VARCHAR(128) NOT NULL,
   passwordHash VARCHAR(256) NOT NULL,
   isAdmin BOOLEAN,
   PRIMARY KEY(profileID)
);

CREATE TABLE Car(
   carID INT,
   brand VARCHAR(50) NOT NULL,
   model VARCHAR(50) NOT NULL,
   isManual BOOLEAN NOT NULL,
   passengers TINYINT(127) NOT NULL,
   energyType TINYINT(127) NOT NULL,
   doorsAmount TINYINT(127) NOT NULL,
   renterID INT NOT NULL,
   PRIMARY KEY(carID),
   FOREIGN KEY(renterID) REFERENCES Renter(renterID)
);

CREATE TABLE Rent(
   profileID INT,
   carID INT,
   rentID INT,
   tookDate DATETIME NOT NULL,
   dueDate DATETIME NOT NULL,
   price DECIMAL(3,0) NOT NULL,
   returnedDate DATETIME,
   returnedCondition TINYINT(127),
   PRIMARY KEY(rentID),
   FOREIGN KEY(profileID) REFERENCES Profile(profileID),
   FOREIGN KEY(carID) REFERENCES Car(carID)
);
