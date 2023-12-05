-- Insertion de 4 renters
INSERT INTO Renter (renterID, renterName, address, description, inaugurationDate, closureDate)
VALUES
    (1, 'Car Rentals ABC', '123 Utca Autók, Budapest', 'Quality car rentals', '2022-01-15', NULL),
    (2, 'Express Rentals', '456 Bérlet Avenue, Debrecen', 'Fast and reliable', '2022-02-20', NULL),
    (3, 'LocaCars Hungary', '789 Kölcsonzés út, Szeged', 'The smart choice', '2022-03-10', NULL),
    (4, 'City Rides Magyarország', '1010 Autóvezetők tér, Pécs', 'The ultimate driving experience', '2022-04-05', NULL);

-- Insertion de 10 profiles
INSERT INTO Profile (profileID, firstName, lastName, login, passwordHash, isAdmin)
VALUES
    (1, 'John', 'Doe', 'johndoe', 'password123', TRUE),
    (2, 'Alice', 'Smith', 'alicesmith', 'securepwd', FALSE),
    (3, 'Bob', 'Johnson', 'bobjohnson', 'pass1234', FALSE),
    (4, 'Emily', 'Williams', 'emilywilliams', 'myp@ss', FALSE),
    (5, 'Michael', 'Brown', 'michaelbrown', 'letmein', TRUE),
    (6, 'Linda', 'Davis', 'lindadavis', 'pa$$w0rd', FALSE),
    (7, 'David', 'Lee', 'davidlee', 'password321', FALSE),
    (8, 'Sophia', 'Moore', 'sophiamoore', 's3cur3pwd', FALSE),
    (9, 'William', 'White', 'williamwhite', '1234abcd', FALSE),
    (10, 'Olivia', 'Martin', 'oliviamartin', 'secret@123', FALSE);

-- Insertion de 10 voitures
INSERT INTO Car (carID, brand, model, isManual, passengers, energyType, doorsAmount, renterID, carDescription, pictureLink)
VALUES
    (1, 'Toyota', 'Camry', TRUE, 5, 1, 4, 1, 'A great car', 'https://www.netcarshow.com/Toyota-Camry_Hybrid-2025-1024-01.jpg'),
    (2, 'Honda', 'Accord', TRUE, 5, 2, 4, 2, 'A great car', 'https://www.netcarshow.com/Honda-Accord-2023-1024-01.jpg'),
    (3, 'Ford', 'Fusion', TRUE, 5, 1, 4, 3, 'A great car', 'https://www.netcarshow.com/Ford-Fusion-2019-1024-01.jpg'),
    (4, 'Volkswagen', 'Jetta', TRUE, 5, 2, 4, 4, 'A great car', 'https://www.netcarshow.com/Volkswagen-Jetta_GLI_40th_Anniversary_Edition-2024-1024-01.jpg'),
    (5, 'Chevrolet', 'Malibu', FALSE, 4, 3, 4, 1, 'A great car', 'https://www.netcarshow.com/Chevrolet-Malibu-2019-1024-01.jpg'),
    (6, 'Nissan', 'Sentra', FALSE, 4, 1, 4, 2, 'A great car', 'https://www.netcarshow.com/Nissan-Sentra-2024-1024-07.jpg'),
    (7, 'Hyundai', 'Elantra', TRUE, 5, 2, 4, 3, 'A great car', 'https://www.netcarshow.com/Hyundai-Elantra_N-2024-1024-04.jpg'),
    (8, 'Kia', 'Optima', TRUE, 5, 1, 4, 4, 'A great car', 'https://www.netcarshow.com/Kia-Optima_US-Version-2019-1024-04.jpg'),
    (9, 'Mazda', 'Mazda6', TRUE, 5, 2, 4, 1, 'A great car', 'https://www.netcarshow.com/Mazda-6-2018-1024-05.jpg'),
    (10, 'Subaru', 'Legacy', TRUE, 5, 1, 4, 2, 'A great car', 'https://www.netcarshow.com/Subaru-Legacy-2020-1024-01.jpg');

-- Insertion de 5 locations
INSERT INTO Rent (profileID, carID, tookDate, dueDate, price, returnedDate, returnedCondition)
VALUES
    (1, 1, '2023-05-01 12:00:00', '2023-05-05 12:00:00', 250.00, '2023-05-04 14:30:00', 5),
    (2, 2, '2023-05-02 13:15:00', '2023-05-06 13:15:00', 275.00, '2023-05-06 16:45:00', 4),
    (3, 3, '2023-05-03 09:30:00', '2023-05-07 09:30:00', 300.00, NULL, NULL),
    (4, 4, '2023-05-04 10:45:00', '2023-05-08 10:45:00', 325.00, NULL, NULL),
    (5, 5, '2023-05-05 11:00:00', '2023-05-09 11:00:00', 350.00, NULL, NULL);
