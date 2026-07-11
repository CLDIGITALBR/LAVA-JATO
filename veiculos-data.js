// Lista de veiculos: tipo, marca e modelo
// Cada objeto representa uma combinacao valida
const veiculosData = [
  {
    "tipo": "Carro",
    "marca": "Audi",
    "modelo": "A1"
  },
  {
    "tipo": "Carro",
    "marca": "Audi",
    "modelo": "A3"
  },
  {
    "tipo": "Carro",
    "marca": "Audi",
    "modelo": "A4"
  },
  {
    "tipo": "Carro",
    "marca": "Audi",
    "modelo": "A5"
  },
  {
    "tipo": "Carro",
    "marca": "Audi",
    "modelo": "A6"
  },
  {
    "tipo": "Carro",
    "marca": "Audi",
    "modelo": "A7"
  },
  {
    "tipo": "Carro",
    "marca": "Audi",
    "modelo": "A8"
  },
  {
    "tipo": "Carro",
    "marca": "Audi",
    "modelo": "e-tron"
  },
  {
    "tipo": "Carro",
    "marca": "Audi",
    "modelo": "e-tron GT"
  },
  {
    "tipo": "Carro",
    "marca": "Audi",
    "modelo": "Q2"
  },
  {
    "tipo": "Carro",
    "marca": "Audi",
    "modelo": "Q3"
  },
  {
    "tipo": "Carro",
    "marca": "Audi",
    "modelo": "Q5"
  },
  {
    "tipo": "Carro",
    "marca": "Audi",
    "modelo": "Q7"
  },
  {
    "tipo": "Carro",
    "marca": "Audi",
    "modelo": "Q8"
  },
  {
    "tipo": "Carro",
    "marca": "Audi",
    "modelo": "R8"
  },
  {
    "tipo": "Carro",
    "marca": "Audi",
    "modelo": "TT"
  },
  {
    "tipo": "Carro",
    "marca": "Audi",
    "modelo": "Outro"
  },
  {
    "tipo": "Carro",
    "marca": "BMW",
    "modelo": "i4"
  },
  {
    "tipo": "Carro",
    "marca": "BMW",
    "modelo": "iX1"
  },
  {
    "tipo": "Carro",
    "marca": "BMW",
    "modelo": "iX3"
  },
  {
    "tipo": "Carro",
    "marca": "BMW",
    "modelo": "M2"
  },
  {
    "tipo": "Carro",
    "marca": "BMW",
    "modelo": "M3"
  },
  {
    "tipo": "Carro",
    "marca": "BMW",
    "modelo": "M4"
  },
  {
    "tipo": "Carro",
    "marca": "BMW",
    "modelo": "Série 1"
  },
  {
    "tipo": "Carro",
    "marca": "BMW",
    "modelo": "Série 2"
  },
  {
    "tipo": "Carro",
    "marca": "BMW",
    "modelo": "Série 3"
  },
  {
    "tipo": "Carro",
    "marca": "BMW",
    "modelo": "Série 4"
  },
  {
    "tipo": "Carro",
    "marca": "BMW",
    "modelo": "Série 5"
  },
  {
    "tipo": "Carro",
    "marca": "BMW",
    "modelo": "Série 7"
  },
  {
    "tipo": "Carro",
    "marca": "BMW",
    "modelo": "X1"
  },
  {
    "tipo": "Carro",
    "marca": "BMW",
    "modelo": "X2"
  },
  {
    "tipo": "Carro",
    "marca": "BMW",
    "modelo": "X3"
  },
  {
    "tipo": "Carro",
    "marca": "BMW",
    "modelo": "X4"
  },
  {
    "tipo": "Carro",
    "marca": "BMW",
    "modelo": "X5"
  },
  {
    "tipo": "Carro",
    "marca": "BMW",
    "modelo": "X6"
  },
  {
    "tipo": "Carro",
    "marca": "BMW",
    "modelo": "Outro"
  },
  {
    "tipo": "Carro",
    "marca": "BYD",
    "modelo": "Dolphin"
  },
  {
    "tipo": "Carro",
    "marca": "BYD",
    "modelo": "Dolphin Mini"
  },
  {
    "tipo": "Carro",
    "marca": "BYD",
    "modelo": "Han"
  },
  {
    "tipo": "Carro",
    "marca": "BYD",
    "modelo": "King"
  },
  {
    "tipo": "Carro",
    "marca": "BYD",
    "modelo": "Seal"
  },
  {
    "tipo": "Carro",
    "marca": "BYD",
    "modelo": "Song Plus"
  },
  {
    "tipo": "Carro",
    "marca": "BYD",
    "modelo": "Tan"
  },
  {
    "tipo": "Carro",
    "marca": "BYD",
    "modelo": "Yuan Plus"
  },
  {
    "tipo": "Carro",
    "marca": "BYD",
    "modelo": "Outro"
  },
  {
    "tipo": "Carro",
    "marca": "Caoa Chery",
    "modelo": "Arrizo 6"
  },
  {
    "tipo": "Carro",
    "marca": "Caoa Chery",
    "modelo": "Tiggo 2"
  },
  {
    "tipo": "Carro",
    "marca": "Caoa Chery",
    "modelo": "Tiggo 5x"
  },
  {
    "tipo": "Carro",
    "marca": "Caoa Chery",
    "modelo": "Tiggo 7"
  },
  {
    "tipo": "Carro",
    "marca": "Caoa Chery",
    "modelo": "Tiggo 8"
  },
  {
    "tipo": "Carro",
    "marca": "Caoa Chery",
    "modelo": "Outro"
  },
  {
    "tipo": "Carro",
    "marca": "Chevrolet",
    "modelo": "Agile"
  },
  {
    "tipo": "Carro",
    "marca": "Chevrolet",
    "modelo": "Astra"
  },
  {
    "tipo": "Carro",
    "marca": "Chevrolet",
    "modelo": "Blazer"
  },
  {
    "tipo": "Carro",
    "marca": "Chevrolet",
    "modelo": "Camaro"
  },
  {
    "tipo": "Carro",
    "marca": "Chevrolet",
    "modelo": "Captiva"
  },
  {
    "tipo": "Carro",
    "marca": "Chevrolet",
    "modelo": "Classic"
  },
  {
    "tipo": "Carro",
    "marca": "Chevrolet",
    "modelo": "Cobalt"
  },
  {
    "tipo": "Carro",
    "marca": "Chevrolet",
    "modelo": "Corsa"
  },
  {
    "tipo": "Carro",
    "marca": "Chevrolet",
    "modelo": "Corvette"
  },
  {
    "tipo": "Carro",
    "marca": "Chevrolet",
    "modelo": "Cruze"
  },
  {
    "tipo": "Carro",
    "marca": "Chevrolet",
    "modelo": "Cruze Sport6"
  },
  {
    "tipo": "Carro",
    "marca": "Chevrolet",
    "modelo": "Equinox"
  },
  {
    "tipo": "Carro",
    "marca": "Chevrolet",
    "modelo": "Meriva"
  },
  {
    "tipo": "Carro",
    "marca": "Chevrolet",
    "modelo": "Montana"
  },
  {
    "tipo": "Carro",
    "marca": "Chevrolet",
    "modelo": "Onix"
  },
  {
    "tipo": "Carro",
    "marca": "Chevrolet",
    "modelo": "Onix Plus"
  },
  {
    "tipo": "Carro",
    "marca": "Chevrolet",
    "modelo": "S10"
  },
  {
    "tipo": "Carro",
    "marca": "Chevrolet",
    "modelo": "Spin"
  },
  {
    "tipo": "Carro",
    "marca": "Chevrolet",
    "modelo": "Tracker"
  },
  {
    "tipo": "Carro",
    "marca": "Chevrolet",
    "modelo": "Tracker Premier"
  },
  {
    "tipo": "Carro",
    "marca": "Chevrolet",
    "modelo": "Trailblazer"
  },
  {
    "tipo": "Carro",
    "marca": "Chevrolet",
    "modelo": "Vectra"
  },
  {
    "tipo": "Carro",
    "marca": "Chevrolet",
    "modelo": "Zafira"
  },
  {
    "tipo": "Carro",
    "marca": "Chevrolet",
    "modelo": "Outro"
  },
  {
    "tipo": "Carro",
    "marca": "Citroën",
    "modelo": "Basalt"
  },
  {
    "tipo": "Carro",
    "marca": "Citroën",
    "modelo": "Berlingo"
  },
  {
    "tipo": "Carro",
    "marca": "Citroën",
    "modelo": "C3"
  },
  {
    "tipo": "Carro",
    "marca": "Citroën",
    "modelo": "C3 Aircross"
  },
  {
    "tipo": "Carro",
    "marca": "Citroën",
    "modelo": "C4 Cactus"
  },
  {
    "tipo": "Carro",
    "marca": "Citroën",
    "modelo": "C4 Lounge"
  },
  {
    "tipo": "Carro",
    "marca": "Citroën",
    "modelo": "C5 Aircross"
  },
  {
    "tipo": "Carro",
    "marca": "Citroën",
    "modelo": "Jumper"
  },
  {
    "tipo": "Carro",
    "marca": "Citroën",
    "modelo": "Jumpy"
  },
  {
    "tipo": "Carro",
    "marca": "Citroën",
    "modelo": "Outro"
  },
  {
    "tipo": "Carro",
    "marca": "Fiat",
    "modelo": "500"
  },
  {
    "tipo": "Carro",
    "marca": "Fiat",
    "modelo": "Argo"
  },
  {
    "tipo": "Carro",
    "marca": "Fiat",
    "modelo": "Argo Trekking"
  },
  {
    "tipo": "Carro",
    "marca": "Fiat",
    "modelo": "Bravo"
  },
  {
    "tipo": "Carro",
    "marca": "Fiat",
    "modelo": "Cronos"
  },
  {
    "tipo": "Carro",
    "marca": "Fiat",
    "modelo": "Doblo"
  },
  {
    "tipo": "Carro",
    "marca": "Fiat",
    "modelo": "Fastback"
  },
  {
    "tipo": "Carro",
    "marca": "Fiat",
    "modelo": "Fastback Abarth"
  },
  {
    "tipo": "Carro",
    "marca": "Fiat",
    "modelo": "Fiorino"
  },
  {
    "tipo": "Carro",
    "marca": "Fiat",
    "modelo": "Grand Siena"
  },
  {
    "tipo": "Carro",
    "marca": "Fiat",
    "modelo": "Linea"
  },
  {
    "tipo": "Carro",
    "marca": "Fiat",
    "modelo": "Palio"
  },
  {
    "tipo": "Carro",
    "marca": "Fiat",
    "modelo": "Pulse"
  },
  {
    "tipo": "Carro",
    "marca": "Fiat",
    "modelo": "Pulse Abarth"
  },
  {
    "tipo": "Carro",
    "marca": "Fiat",
    "modelo": "Siena"
  },
  {
    "tipo": "Carro",
    "marca": "Fiat",
    "modelo": "Strada"
  },
  {
    "tipo": "Carro",
    "marca": "Fiat",
    "modelo": "Toro"
  },
  {
    "tipo": "Carro",
    "marca": "Fiat",
    "modelo": "Toro Ultra"
  },
  {
    "tipo": "Carro",
    "marca": "Fiat",
    "modelo": "Uno"
  },
  {
    "tipo": "Carro",
    "marca": "Fiat",
    "modelo": "Outro"
  },
  {
    "tipo": "Carro",
    "marca": "Ford",
    "modelo": "Bronco"
  },
  {
    "tipo": "Carro",
    "marca": "Ford",
    "modelo": "EcoSport"
  },
  {
    "tipo": "Carro",
    "marca": "Ford",
    "modelo": "Edge"
  },
  {
    "tipo": "Carro",
    "marca": "Ford",
    "modelo": "Fusion"
  },
  {
    "tipo": "Carro",
    "marca": "Ford",
    "modelo": "Ka"
  },
  {
    "tipo": "Carro",
    "marca": "Ford",
    "modelo": "Ka Sedan"
  },
  {
    "tipo": "Carro",
    "marca": "Ford",
    "modelo": "Mustang"
  },
  {
    "tipo": "Carro",
    "marca": "Ford",
    "modelo": "Mustang Mach-E"
  },
  {
    "tipo": "Carro",
    "marca": "Ford",
    "modelo": "Ranger"
  },
  {
    "tipo": "Carro",
    "marca": "Ford",
    "modelo": "Ranger Raptor"
  },
  {
    "tipo": "Carro",
    "marca": "Ford",
    "modelo": "Territory"
  },
  {
    "tipo": "Carro",
    "marca": "Ford",
    "modelo": "Outro"
  },
  {
    "tipo": "Carro",
    "marca": "GWM",
    "modelo": "Haval H2"
  },
  {
    "tipo": "Carro",
    "marca": "GWM",
    "modelo": "Haval H6"
  },
  {
    "tipo": "Carro",
    "marca": "GWM",
    "modelo": "Ora 03"
  },
  {
    "tipo": "Carro",
    "marca": "GWM",
    "modelo": "Tank 300"
  },
  {
    "tipo": "Carro",
    "marca": "GWM",
    "modelo": "Outro"
  },
  {
    "tipo": "Carro",
    "marca": "Honda",
    "modelo": "Accord"
  },
  {
    "tipo": "Carro",
    "marca": "Honda",
    "modelo": "City"
  },
  {
    "tipo": "Carro",
    "marca": "Honda",
    "modelo": "City Hatch"
  },
  {
    "tipo": "Carro",
    "marca": "Honda",
    "modelo": "Civic"
  },
  {
    "tipo": "Carro",
    "marca": "Honda",
    "modelo": "Civic Si"
  },
  {
    "tipo": "Carro",
    "marca": "Honda",
    "modelo": "Civic Type R"
  },
  {
    "tipo": "Carro",
    "marca": "Honda",
    "modelo": "CR-V"
  },
  {
    "tipo": "Carro",
    "marca": "Honda",
    "modelo": "Fit"
  },
  {
    "tipo": "Carro",
    "marca": "Honda",
    "modelo": "HR-V"
  },
  {
    "tipo": "Carro",
    "marca": "Honda",
    "modelo": "WR-V"
  },
  {
    "tipo": "Carro",
    "marca": "Honda",
    "modelo": "Outro"
  },
  {
    "tipo": "Carro",
    "marca": "Hyundai",
    "modelo": "Azera"
  },
  {
    "tipo": "Carro",
    "marca": "Hyundai",
    "modelo": "Creta"
  },
  {
    "tipo": "Carro",
    "marca": "Hyundai",
    "modelo": "Creta Limited"
  },
  {
    "tipo": "Carro",
    "marca": "Hyundai",
    "modelo": "HB20"
  },
  {
    "tipo": "Carro",
    "marca": "Hyundai",
    "modelo": "HB20S"
  },
  {
    "tipo": "Carro",
    "marca": "Hyundai",
    "modelo": "HB20X"
  },
  {
    "tipo": "Carro",
    "marca": "Hyundai",
    "modelo": "i30"
  },
  {
    "tipo": "Carro",
    "marca": "Hyundai",
    "modelo": "IONIQ 5"
  },
  {
    "tipo": "Carro",
    "marca": "Hyundai",
    "modelo": "IONIQ 6"
  },
  {
    "tipo": "Carro",
    "marca": "Hyundai",
    "modelo": "Santa Fe"
  },
  {
    "tipo": "Carro",
    "marca": "Hyundai",
    "modelo": "Tucson"
  },
  {
    "tipo": "Carro",
    "marca": "Hyundai",
    "modelo": "Veloster"
  },
  {
    "tipo": "Carro",
    "marca": "Hyundai",
    "modelo": "Outro"
  },
  {
    "tipo": "Carro",
    "marca": "Jeep",
    "modelo": "Commander"
  },
  {
    "tipo": "Carro",
    "marca": "Jeep",
    "modelo": "Commander Overland"
  },
  {
    "tipo": "Carro",
    "marca": "Jeep",
    "modelo": "Compass"
  },
  {
    "tipo": "Carro",
    "marca": "Jeep",
    "modelo": "Compass Limited"
  },
  {
    "tipo": "Carro",
    "marca": "Jeep",
    "modelo": "Gladiator"
  },
  {
    "tipo": "Carro",
    "marca": "Jeep",
    "modelo": "Grand Cherokee"
  },
  {
    "tipo": "Carro",
    "marca": "Jeep",
    "modelo": "Renegade"
  },
  {
    "tipo": "Carro",
    "marca": "Jeep",
    "modelo": "Renegade Sport"
  },
  {
    "tipo": "Carro",
    "marca": "Jeep",
    "modelo": "Wrangler"
  },
  {
    "tipo": "Carro",
    "marca": "Jeep",
    "modelo": "Outro"
  },
  {
    "tipo": "Carro",
    "marca": "Kia",
    "modelo": "Carnival"
  },
  {
    "tipo": "Carro",
    "marca": "Kia",
    "modelo": "Cerato"
  },
  {
    "tipo": "Carro",
    "marca": "Kia",
    "modelo": "EV6"
  },
  {
    "tipo": "Carro",
    "marca": "Kia",
    "modelo": "Niro"
  },
  {
    "tipo": "Carro",
    "marca": "Kia",
    "modelo": "Picanto"
  },
  {
    "tipo": "Carro",
    "marca": "Kia",
    "modelo": "Seltos"
  },
  {
    "tipo": "Carro",
    "marca": "Kia",
    "modelo": "Sorento"
  },
  {
    "tipo": "Carro",
    "marca": "Kia",
    "modelo": "Sportage"
  },
  {
    "tipo": "Carro",
    "marca": "Kia",
    "modelo": "Stinger"
  },
  {
    "tipo": "Carro",
    "marca": "Kia",
    "modelo": "Telluride"
  },
  {
    "tipo": "Carro",
    "marca": "Kia",
    "modelo": "Outro"
  },
  {
    "tipo": "Carro",
    "marca": "Land Rover",
    "modelo": "Defender"
  },
  {
    "tipo": "Carro",
    "marca": "Land Rover",
    "modelo": "Discovery"
  },
  {
    "tipo": "Carro",
    "marca": "Land Rover",
    "modelo": "Discovery Sport"
  },
  {
    "tipo": "Carro",
    "marca": "Land Rover",
    "modelo": "Range Rover"
  },
  {
    "tipo": "Carro",
    "marca": "Land Rover",
    "modelo": "Range Rover Evoque"
  },
  {
    "tipo": "Carro",
    "marca": "Land Rover",
    "modelo": "Range Rover Sport"
  },
  {
    "tipo": "Carro",
    "marca": "Land Rover",
    "modelo": "Range Rover Velar"
  },
  {
    "tipo": "Carro",
    "marca": "Land Rover",
    "modelo": "Outro"
  },
  {
    "tipo": "Carro",
    "marca": "Lexus",
    "modelo": "ES"
  },
  {
    "tipo": "Carro",
    "marca": "Lexus",
    "modelo": "IS"
  },
  {
    "tipo": "Carro",
    "marca": "Lexus",
    "modelo": "LX"
  },
  {
    "tipo": "Carro",
    "marca": "Lexus",
    "modelo": "NX"
  },
  {
    "tipo": "Carro",
    "marca": "Lexus",
    "modelo": "RX"
  },
  {
    "tipo": "Carro",
    "marca": "Lexus",
    "modelo": "UX"
  },
  {
    "tipo": "Carro",
    "marca": "Lexus",
    "modelo": "Outro"
  },
  {
    "tipo": "Carro",
    "marca": "Mercedes-Benz",
    "modelo": "AMG GT"
  },
  {
    "tipo": "Carro",
    "marca": "Mercedes-Benz",
    "modelo": "Classe A"
  },
  {
    "tipo": "Carro",
    "marca": "Mercedes-Benz",
    "modelo": "Classe B"
  },
  {
    "tipo": "Carro",
    "marca": "Mercedes-Benz",
    "modelo": "Classe C"
  },
  {
    "tipo": "Carro",
    "marca": "Mercedes-Benz",
    "modelo": "Classe E"
  },
  {
    "tipo": "Carro",
    "marca": "Mercedes-Benz",
    "modelo": "Classe S"
  },
  {
    "tipo": "Carro",
    "marca": "Mercedes-Benz",
    "modelo": "EQA"
  },
  {
    "tipo": "Carro",
    "marca": "Mercedes-Benz",
    "modelo": "EQB"
  },
  {
    "tipo": "Carro",
    "marca": "Mercedes-Benz",
    "modelo": "EQC"
  },
  {
    "tipo": "Carro",
    "marca": "Mercedes-Benz",
    "modelo": "GLA"
  },
  {
    "tipo": "Carro",
    "marca": "Mercedes-Benz",
    "modelo": "GLB"
  },
  {
    "tipo": "Carro",
    "marca": "Mercedes-Benz",
    "modelo": "GLC"
  },
  {
    "tipo": "Carro",
    "marca": "Mercedes-Benz",
    "modelo": "GLE"
  },
  {
    "tipo": "Carro",
    "marca": "Mercedes-Benz",
    "modelo": "GLS"
  },
  {
    "tipo": "Carro",
    "marca": "Mercedes-Benz",
    "modelo": "Outro"
  },
  {
    "tipo": "Carro",
    "marca": "Mitsubishi",
    "modelo": "ASX"
  },
  {
    "tipo": "Carro",
    "marca": "Mitsubishi",
    "modelo": "Eclipse Cross"
  },
  {
    "tipo": "Carro",
    "marca": "Mitsubishi",
    "modelo": "L200 Savana"
  },
  {
    "tipo": "Carro",
    "marca": "Mitsubishi",
    "modelo": "L200 Triton"
  },
  {
    "tipo": "Carro",
    "marca": "Mitsubishi",
    "modelo": "Lancer"
  },
  {
    "tipo": "Carro",
    "marca": "Mitsubishi",
    "modelo": "Outlander"
  },
  {
    "tipo": "Carro",
    "marca": "Mitsubishi",
    "modelo": "Pajero"
  },
  {
    "tipo": "Carro",
    "marca": "Mitsubishi",
    "modelo": "Pajero Full"
  },
  {
    "tipo": "Carro",
    "marca": "Mitsubishi",
    "modelo": "Pajero Sport"
  },
  {
    "tipo": "Carro",
    "marca": "Mitsubishi",
    "modelo": "Outro"
  },
  {
    "tipo": "Carro",
    "marca": "Nissan",
    "modelo": "Frontier"
  },
  {
    "tipo": "Carro",
    "marca": "Nissan",
    "modelo": "Kicks"
  },
  {
    "tipo": "Carro",
    "marca": "Nissan",
    "modelo": "Kicks Advance"
  },
  {
    "tipo": "Carro",
    "marca": "Nissan",
    "modelo": "Leaf"
  },
  {
    "tipo": "Carro",
    "marca": "Nissan",
    "modelo": "Livina"
  },
  {
    "tipo": "Carro",
    "marca": "Nissan",
    "modelo": "March"
  },
  {
    "tipo": "Carro",
    "marca": "Nissan",
    "modelo": "Murano"
  },
  {
    "tipo": "Carro",
    "marca": "Nissan",
    "modelo": "Sentra"
  },
  {
    "tipo": "Carro",
    "marca": "Nissan",
    "modelo": "Versa"
  },
  {
    "tipo": "Carro",
    "marca": "Nissan",
    "modelo": "Outro"
  },
  {
    "tipo": "Carro",
    "marca": "Peugeot",
    "modelo": "2008"
  },
  {
    "tipo": "Carro",
    "marca": "Peugeot",
    "modelo": "208"
  },
  {
    "tipo": "Carro",
    "marca": "Peugeot",
    "modelo": "3008"
  },
  {
    "tipo": "Carro",
    "marca": "Peugeot",
    "modelo": "308"
  },
  {
    "tipo": "Carro",
    "marca": "Peugeot",
    "modelo": "408"
  },
  {
    "tipo": "Carro",
    "marca": "Peugeot",
    "modelo": "5008"
  },
  {
    "tipo": "Carro",
    "marca": "Peugeot",
    "modelo": "Expert"
  },
  {
    "tipo": "Carro",
    "marca": "Peugeot",
    "modelo": "Landtrek"
  },
  {
    "tipo": "Carro",
    "marca": "Peugeot",
    "modelo": "Partner"
  },
  {
    "tipo": "Carro",
    "marca": "Peugeot",
    "modelo": "Outro"
  },
  {
    "tipo": "Carro",
    "marca": "Porsche",
    "modelo": "718"
  },
  {
    "tipo": "Carro",
    "marca": "Porsche",
    "modelo": "911"
  },
  {
    "tipo": "Carro",
    "marca": "Porsche",
    "modelo": "Cayenne"
  },
  {
    "tipo": "Carro",
    "marca": "Porsche",
    "modelo": "Macan"
  },
  {
    "tipo": "Carro",
    "marca": "Porsche",
    "modelo": "Taycan"
  },
  {
    "tipo": "Carro",
    "marca": "Porsche",
    "modelo": "Outro"
  },
  {
    "tipo": "Carro",
    "marca": "Renault",
    "modelo": "Captur"
  },
  {
    "tipo": "Carro",
    "marca": "Renault",
    "modelo": "Duster"
  },
  {
    "tipo": "Carro",
    "marca": "Renault",
    "modelo": "Duster Oroch"
  },
  {
    "tipo": "Carro",
    "marca": "Renault",
    "modelo": "Fluence"
  },
  {
    "tipo": "Carro",
    "marca": "Renault",
    "modelo": "Kardian"
  },
  {
    "tipo": "Carro",
    "marca": "Renault",
    "modelo": "Kwid"
  },
  {
    "tipo": "Carro",
    "marca": "Renault",
    "modelo": "Kwid Outsider"
  },
  {
    "tipo": "Carro",
    "marca": "Renault",
    "modelo": "Logan"
  },
  {
    "tipo": "Carro",
    "marca": "Renault",
    "modelo": "Megane"
  },
  {
    "tipo": "Carro",
    "marca": "Renault",
    "modelo": "Sandero"
  },
  {
    "tipo": "Carro",
    "marca": "Renault",
    "modelo": "Sandero Stepway"
  },
  {
    "tipo": "Carro",
    "marca": "Renault",
    "modelo": "Zoe"
  },
  {
    "tipo": "Carro",
    "marca": "Renault",
    "modelo": "Outro"
  },
  {
    "tipo": "Carro",
    "marca": "Subaru",
    "modelo": "BRZ"
  },
  {
    "tipo": "Carro",
    "marca": "Subaru",
    "modelo": "Forester"
  },
  {
    "tipo": "Carro",
    "marca": "Subaru",
    "modelo": "Impreza"
  },
  {
    "tipo": "Carro",
    "marca": "Subaru",
    "modelo": "Outback"
  },
  {
    "tipo": "Carro",
    "marca": "Subaru",
    "modelo": "XV"
  },
  {
    "tipo": "Carro",
    "marca": "Subaru",
    "modelo": "Outro"
  },
  {
    "tipo": "Carro",
    "marca": "Toyota",
    "modelo": "Camry"
  },
  {
    "tipo": "Carro",
    "marca": "Toyota",
    "modelo": "Corolla"
  },
  {
    "tipo": "Carro",
    "marca": "Toyota",
    "modelo": "Corolla Cross"
  },
  {
    "tipo": "Carro",
    "marca": "Toyota",
    "modelo": "Etios"
  },
  {
    "tipo": "Carro",
    "marca": "Toyota",
    "modelo": "GR86"
  },
  {
    "tipo": "Carro",
    "marca": "Toyota",
    "modelo": "Hilux"
  },
  {
    "tipo": "Carro",
    "marca": "Toyota",
    "modelo": "Hilux SW4"
  },
  {
    "tipo": "Carro",
    "marca": "Toyota",
    "modelo": "Land Cruiser"
  },
  {
    "tipo": "Carro",
    "marca": "Toyota",
    "modelo": "Prius"
  },
  {
    "tipo": "Carro",
    "marca": "Toyota",
    "modelo": "RAV4"
  },
  {
    "tipo": "Carro",
    "marca": "Toyota",
    "modelo": "Supra"
  },
  {
    "tipo": "Carro",
    "marca": "Toyota",
    "modelo": "Yaris"
  },
  {
    "tipo": "Carro",
    "marca": "Toyota",
    "modelo": "Yaris Sedan"
  },
  {
    "tipo": "Carro",
    "marca": "Toyota",
    "modelo": "Outro"
  },
  {
    "tipo": "Carro",
    "marca": "Volkswagen",
    "modelo": "Amarok"
  },
  {
    "tipo": "Carro",
    "marca": "Volkswagen",
    "modelo": "CrossFox"
  },
  {
    "tipo": "Carro",
    "marca": "Volkswagen",
    "modelo": "Fox"
  },
  {
    "tipo": "Carro",
    "marca": "Volkswagen",
    "modelo": "Gol"
  },
  {
    "tipo": "Carro",
    "marca": "Volkswagen",
    "modelo": "Gol Rallye"
  },
  {
    "tipo": "Carro",
    "marca": "Volkswagen",
    "modelo": "Golf"
  },
  {
    "tipo": "Carro",
    "marca": "Volkswagen",
    "modelo": "Golf GTI"
  },
  {
    "tipo": "Carro",
    "marca": "Volkswagen",
    "modelo": "Jetta"
  },
  {
    "tipo": "Carro",
    "marca": "Volkswagen",
    "modelo": "Passat"
  },
  {
    "tipo": "Carro",
    "marca": "Volkswagen",
    "modelo": "Polo"
  },
  {
    "tipo": "Carro",
    "marca": "Volkswagen",
    "modelo": "Polo Track"
  },
  {
    "tipo": "Carro",
    "marca": "Volkswagen",
    "modelo": "Saveiro"
  },
  {
    "tipo": "Carro",
    "marca": "Volkswagen",
    "modelo": "SpaceFox"
  },
  {
    "tipo": "Carro",
    "marca": "Volkswagen",
    "modelo": "T-Cross"
  },
  {
    "tipo": "Carro",
    "marca": "Volkswagen",
    "modelo": "Taos"
  },
  {
    "tipo": "Carro",
    "marca": "Volkswagen",
    "modelo": "Tiguan"
  },
  {
    "tipo": "Carro",
    "marca": "Volkswagen",
    "modelo": "Touareg"
  },
  {
    "tipo": "Carro",
    "marca": "Volkswagen",
    "modelo": "Virtus"
  },
  {
    "tipo": "Carro",
    "marca": "Volkswagen",
    "modelo": "Voyage"
  },
  {
    "tipo": "Carro",
    "marca": "Volkswagen",
    "modelo": "Outro"
  },
  {
    "tipo": "Carro",
    "marca": "Volvo",
    "modelo": "S60"
  },
  {
    "tipo": "Carro",
    "marca": "Volvo",
    "modelo": "V60"
  },
  {
    "tipo": "Carro",
    "marca": "Volvo",
    "modelo": "XC40"
  },
  {
    "tipo": "Carro",
    "marca": "Volvo",
    "modelo": "XC60"
  },
  {
    "tipo": "Carro",
    "marca": "Volvo",
    "modelo": "XC90"
  },
  {
    "tipo": "Carro",
    "marca": "Volvo",
    "modelo": "Outro"
  },
  {
    "tipo": "Moto",
    "marca": "Honda",
    "modelo": "CG 160 Fan"
  },
  {
    "tipo": "Moto",
    "marca": "Honda",
    "modelo": "CG 160 Titan"
  },
  {
    "tipo": "Moto",
    "marca": "Honda",
    "modelo": "CG 160 Start"
  },
  {
    "tipo": "Moto",
    "marca": "Honda",
    "modelo": "Biz 125"
  },
  {
    "tipo": "Moto",
    "marca": "Honda",
    "modelo": "Pop 110i"
  },
  {
    "tipo": "Moto",
    "marca": "Honda",
    "modelo": "CB 300"
  },
  {
    "tipo": "Moto",
    "marca": "Honda",
    "modelo": "CB 300F"
  },
  {
    "tipo": "Moto",
    "marca": "Honda",
    "modelo": "CB 500"
  },
  {
    "tipo": "Moto",
    "marca": "Honda",
    "modelo": "CB 500F"
  },
  {
    "tipo": "Moto",
    "marca": "Honda",
    "modelo": "CB 500X"
  },
  {
    "tipo": "Moto",
    "marca": "Honda",
    "modelo": "CB 600F Hornet"
  },
  {
    "tipo": "Moto",
    "marca": "Honda",
    "modelo": "CB 650R"
  },
  {
    "tipo": "Moto",
    "marca": "Honda",
    "modelo": "CB 750 Hornet"
  },
  {
    "tipo": "Moto",
    "marca": "Honda",
    "modelo": "CB 1000R"
  },
  {
    "tipo": "Moto",
    "marca": "Honda",
    "modelo": "CBR 500R"
  },
  {
    "tipo": "Moto",
    "marca": "Honda",
    "modelo": "CBR 650R"
  },
  {
    "tipo": "Moto",
    "marca": "Honda",
    "modelo": "CBR 1000RR"
  },
  {
    "tipo": "Moto",
    "marca": "Honda",
    "modelo": "XRE 190"
  },
  {
    "tipo": "Moto",
    "marca": "Honda",
    "modelo": "XRE 300"
  },
  {
    "tipo": "Moto",
    "marca": "Honda",
    "modelo": "NXR 160 Bros"
  },
  {
    "tipo": "Moto",
    "marca": "Honda",
    "modelo": "NC 750X"
  },
  {
    "tipo": "Moto",
    "marca": "Honda",
    "modelo": "Africa Twin"
  },
  {
    "tipo": "Moto",
    "marca": "Honda",
    "modelo": "PCX 150"
  },
  {
    "tipo": "Moto",
    "marca": "Honda",
    "modelo": "PCX 160"
  },
  {
    "tipo": "Moto",
    "marca": "Honda",
    "modelo": "ADV 150"
  },
  {
    "tipo": "Moto",
    "marca": "Honda",
    "modelo": "Goldwing"
  },
  {
    "tipo": "Moto",
    "marca": "Honda",
    "modelo": "Outra"
  },
  {
    "tipo": "Moto",
    "marca": "Yamaha",
    "modelo": "Factor 150"
  },
  {
    "tipo": "Moto",
    "marca": "Yamaha",
    "modelo": "Fazer 150"
  },
  {
    "tipo": "Moto",
    "marca": "Yamaha",
    "modelo": "Fazer 250"
  },
  {
    "tipo": "Moto",
    "marca": "Yamaha",
    "modelo": "MT-03"
  },
  {
    "tipo": "Moto",
    "marca": "Yamaha",
    "modelo": "MT-07"
  },
  {
    "tipo": "Moto",
    "marca": "Yamaha",
    "modelo": "MT-09"
  },
  {
    "tipo": "Moto",
    "marca": "Yamaha",
    "modelo": "MT-10"
  },
  {
    "tipo": "Moto",
    "marca": "Yamaha",
    "modelo": "Lander 250"
  },
  {
    "tipo": "Moto",
    "marca": "Yamaha",
    "modelo": "Ténéré 250"
  },
  {
    "tipo": "Moto",
    "marca": "Yamaha",
    "modelo": "Ténéré 700"
  },
  {
    "tipo": "Moto",
    "marca": "Yamaha",
    "modelo": "XJ6"
  },
  {
    "tipo": "Moto",
    "marca": "Yamaha",
    "modelo": "YZF-R3"
  },
  {
    "tipo": "Moto",
    "marca": "Yamaha",
    "modelo": "YZF-R6"
  },
  {
    "tipo": "Moto",
    "marca": "Yamaha",
    "modelo": "YZF-R1"
  },
  {
    "tipo": "Moto",
    "marca": "Yamaha",
    "modelo": "NMAX 160"
  },
  {
    "tipo": "Moto",
    "marca": "Yamaha",
    "modelo": "XMAX 250"
  },
  {
    "tipo": "Moto",
    "marca": "Yamaha",
    "modelo": "Neo 125"
  },
  {
    "tipo": "Moto",
    "marca": "Yamaha",
    "modelo": "Crosser 150"
  },
  {
    "tipo": "Moto",
    "marca": "Yamaha",
    "modelo": "Outra"
  },
  {
    "tipo": "Moto",
    "marca": "Suzuki",
    "modelo": "GSX-S150"
  },
  {
    "tipo": "Moto",
    "marca": "Suzuki",
    "modelo": "GSX-S750"
  },
  {
    "tipo": "Moto",
    "marca": "Suzuki",
    "modelo": "GSX-S1000"
  },
  {
    "tipo": "Moto",
    "marca": "Suzuki",
    "modelo": "GSX-R600"
  },
  {
    "tipo": "Moto",
    "marca": "Suzuki",
    "modelo": "GSX-R750"
  },
  {
    "tipo": "Moto",
    "marca": "Suzuki",
    "modelo": "GSX-R1000"
  },
  {
    "tipo": "Moto",
    "marca": "Suzuki",
    "modelo": "V-Strom 650"
  },
  {
    "tipo": "Moto",
    "marca": "Suzuki",
    "modelo": "V-Strom 1050"
  },
  {
    "tipo": "Moto",
    "marca": "Suzuki",
    "modelo": "Burgman 125"
  },
  {
    "tipo": "Moto",
    "marca": "Suzuki",
    "modelo": "Burgman 400"
  },
  {
    "tipo": "Moto",
    "marca": "Suzuki",
    "modelo": "Intruder 125"
  },
  {
    "tipo": "Moto",
    "marca": "Suzuki",
    "modelo": "Hayabusa"
  },
  {
    "tipo": "Moto",
    "marca": "Suzuki",
    "modelo": "Outra"
  },
  {
    "tipo": "Moto",
    "marca": "Kawasaki",
    "modelo": "Ninja 300"
  },
  {
    "tipo": "Moto",
    "marca": "Kawasaki",
    "modelo": "Ninja 400"
  },
  {
    "tipo": "Moto",
    "marca": "Kawasaki",
    "modelo": "Ninja 650"
  },
  {
    "tipo": "Moto",
    "marca": "Kawasaki",
    "modelo": "Ninja ZX-6R"
  },
  {
    "tipo": "Moto",
    "marca": "Kawasaki",
    "modelo": "Ninja ZX-10R"
  },
  {
    "tipo": "Moto",
    "marca": "Kawasaki",
    "modelo": "Z400"
  },
  {
    "tipo": "Moto",
    "marca": "Kawasaki",
    "modelo": "Z650"
  },
  {
    "tipo": "Moto",
    "marca": "Kawasaki",
    "modelo": "Z900"
  },
  {
    "tipo": "Moto",
    "marca": "Kawasaki",
    "modelo": "Versys 650"
  },
  {
    "tipo": "Moto",
    "marca": "Kawasaki",
    "modelo": "Versys 1000"
  },
  {
    "tipo": "Moto",
    "marca": "Kawasaki",
    "modelo": "W800"
  },
  {
    "tipo": "Moto",
    "marca": "Kawasaki",
    "modelo": "Vulcan"
  },
  {
    "tipo": "Moto",
    "marca": "Kawasaki",
    "modelo": "Outra"
  },
  {
    "tipo": "Moto",
    "marca": "BMW",
    "modelo": "G 310 R"
  },
  {
    "tipo": "Moto",
    "marca": "BMW",
    "modelo": "G 310 GS"
  },
  {
    "tipo": "Moto",
    "marca": "BMW",
    "modelo": "F 750 GS"
  },
  {
    "tipo": "Moto",
    "marca": "BMW",
    "modelo": "F 850 GS"
  },
  {
    "tipo": "Moto",
    "marca": "BMW",
    "modelo": "R 1250 GS"
  },
  {
    "tipo": "Moto",
    "marca": "BMW",
    "modelo": "R 1250 RT"
  },
  {
    "tipo": "Moto",
    "marca": "BMW",
    "modelo": "S 1000 RR"
  },
  {
    "tipo": "Moto",
    "marca": "BMW",
    "modelo": "S 1000 XR"
  },
  {
    "tipo": "Moto",
    "marca": "BMW",
    "modelo": "K 1600 GTL"
  },
  {
    "tipo": "Moto",
    "marca": "BMW",
    "modelo": "Outra"
  },
  {
    "tipo": "Moto",
    "marca": "Harley-Davidson",
    "modelo": "Sportster S"
  },
  {
    "tipo": "Moto",
    "marca": "Harley-Davidson",
    "modelo": "Iron 883"
  },
  {
    "tipo": "Moto",
    "marca": "Harley-Davidson",
    "modelo": "Street Bob"
  },
  {
    "tipo": "Moto",
    "marca": "Harley-Davidson",
    "modelo": "Fat Boy"
  },
  {
    "tipo": "Moto",
    "marca": "Harley-Davidson",
    "modelo": "Softail"
  },
  {
    "tipo": "Moto",
    "marca": "Harley-Davidson",
    "modelo": "Road King"
  },
  {
    "tipo": "Moto",
    "marca": "Harley-Davidson",
    "modelo": "Road Glide"
  },
  {
    "tipo": "Moto",
    "marca": "Harley-Davidson",
    "modelo": "Street Glide"
  },
  {
    "tipo": "Moto",
    "marca": "Harley-Davidson",
    "modelo": "Pan America"
  },
  {
    "tipo": "Moto",
    "marca": "Harley-Davidson",
    "modelo": "Outra"
  },
  {
    "tipo": "Moto",
    "marca": "Ducati",
    "modelo": "Monster"
  },
  {
    "tipo": "Moto",
    "marca": "Ducati",
    "modelo": "Panigale V2"
  },
  {
    "tipo": "Moto",
    "marca": "Ducati",
    "modelo": "Panigale V4"
  },
  {
    "tipo": "Moto",
    "marca": "Ducati",
    "modelo": "Streetfighter V4"
  },
  {
    "tipo": "Moto",
    "marca": "Ducati",
    "modelo": "Multistrada"
  },
  {
    "tipo": "Moto",
    "marca": "Ducati",
    "modelo": "Scrambler"
  },
  {
    "tipo": "Moto",
    "marca": "Ducati",
    "modelo": "Diavel"
  },
  {
    "tipo": "Moto",
    "marca": "Ducati",
    "modelo": "Outra"
  },
  {
    "tipo": "Moto",
    "marca": "Shineray",
    "modelo": "Phoenix 50"
  },
  {
    "tipo": "Moto",
    "marca": "Shineray",
    "modelo": "Work 150"
  },
  {
    "tipo": "Moto",
    "marca": "Shineray",
    "modelo": "Outra"
  },
  {
    "tipo": "Moto",
    "marca": "Dafra",
    "modelo": "Apache 150"
  },
  {
    "tipo": "Moto",
    "marca": "Dafra",
    "modelo": "Speed 150"
  },
  {
    "tipo": "Moto",
    "marca": "Dafra",
    "modelo": "Outra"
  },
  {
    "tipo": "Moto",
    "marca": "Kasinski",
    "modelo": "Comet 150"
  },
  {
    "tipo": "Moto",
    "marca": "Kasinski",
    "modelo": "Comet 250"
  },
  {
    "tipo": "Moto",
    "marca": "Kasinski",
    "modelo": "Outra"
  },
  {
    "tipo": "Van",
    "marca": "Mercedes-Benz",
    "modelo": "Sprinter 311"
  },
  {
    "tipo": "Van",
    "marca": "Mercedes-Benz",
    "modelo": "Sprinter 313"
  },
  {
    "tipo": "Van",
    "marca": "Mercedes-Benz",
    "modelo": "Sprinter 415"
  },
  {
    "tipo": "Van",
    "marca": "Mercedes-Benz",
    "modelo": "Sprinter 515"
  },
  {
    "tipo": "Van",
    "marca": "Mercedes-Benz",
    "modelo": "Vito"
  },
  {
    "tipo": "Van",
    "marca": "Mercedes-Benz",
    "modelo": "Viano"
  },
  {
    "tipo": "Van",
    "marca": "Mercedes-Benz",
    "modelo": "Outra"
  },
  {
    "tipo": "Van",
    "marca": "Renault",
    "modelo": "Master Furgão"
  },
  {
    "tipo": "Van",
    "marca": "Renault",
    "modelo": "Master Minibus"
  },
  {
    "tipo": "Van",
    "marca": "Renault",
    "modelo": "Trafic"
  },
  {
    "tipo": "Van",
    "marca": "Renault",
    "modelo": "Outra"
  },
  {
    "tipo": "Van",
    "marca": "Fiat",
    "modelo": "Ducato Furgão"
  },
  {
    "tipo": "Van",
    "marca": "Fiat",
    "modelo": "Ducato Minibus"
  },
  {
    "tipo": "Van",
    "marca": "Fiat",
    "modelo": "Doblo Cargo"
  },
  {
    "tipo": "Van",
    "marca": "Fiat",
    "modelo": "Outra"
  },
  {
    "tipo": "Van",
    "marca": "Volkswagen",
    "modelo": "Transporter"
  },
  {
    "tipo": "Van",
    "marca": "Volkswagen",
    "modelo": "Crafter"
  },
  {
    "tipo": "Van",
    "marca": "Volkswagen",
    "modelo": "Outra"
  },
  {
    "tipo": "Van",
    "marca": "Ford",
    "modelo": "Transit"
  },
  {
    "tipo": "Van",
    "marca": "Ford",
    "modelo": "Transit Custom"
  },
  {
    "tipo": "Van",
    "marca": "Ford",
    "modelo": "Transit Minibus"
  },
  {
    "tipo": "Van",
    "marca": "Ford",
    "modelo": "Outra"
  },
  {
    "tipo": "Van",
    "marca": "Citroën",
    "modelo": "Jumper"
  },
  {
    "tipo": "Van",
    "marca": "Citroën",
    "modelo": "Jumpy"
  },
  {
    "tipo": "Van",
    "marca": "Citroën",
    "modelo": "Outra"
  },
  {
    "tipo": "Van",
    "marca": "Peugeot",
    "modelo": "Boxer"
  },
  {
    "tipo": "Van",
    "marca": "Peugeot",
    "modelo": "Expert"
  },
  {
    "tipo": "Van",
    "marca": "Peugeot",
    "modelo": "Outra"
  },
  {
    "tipo": "Van",
    "marca": "Hyundai",
    "modelo": "H100"
  },
  {
    "tipo": "Van",
    "marca": "Hyundai",
    "modelo": "HR"
  },
  {
    "tipo": "Van",
    "marca": "Hyundai",
    "modelo": "Outra"
  },
  {
    "tipo": "Van",
    "marca": "Toyota",
    "modelo": "Hiace"
  },
  {
    "tipo": "Van",
    "marca": "Toyota",
    "modelo": "Outra"
  },
  {
    "tipo": "Van",
    "marca": "Iveco",
    "modelo": "Daily Furgão"
  },
  {
    "tipo": "Van",
    "marca": "Iveco",
    "modelo": "Daily Minibus"
  },
  {
    "tipo": "Van",
    "marca": "Iveco",
    "modelo": "Outra"
  },
  {
    "tipo": "Caminhão",
    "marca": "Mercedes-Benz",
    "modelo": "Accelo 815"
  },
  {
    "tipo": "Caminhão",
    "marca": "Mercedes-Benz",
    "modelo": "Accelo 1016"
  },
  {
    "tipo": "Caminhão",
    "marca": "Mercedes-Benz",
    "modelo": "Atego 1319"
  },
  {
    "tipo": "Caminhão",
    "marca": "Mercedes-Benz",
    "modelo": "Atego 2426"
  },
  {
    "tipo": "Caminhão",
    "marca": "Mercedes-Benz",
    "modelo": "Axor 2544"
  },
  {
    "tipo": "Caminhão",
    "marca": "Mercedes-Benz",
    "modelo": "Actros 2646"
  },
  {
    "tipo": "Caminhão",
    "marca": "Mercedes-Benz",
    "modelo": "Outro"
  },
  {
    "tipo": "Caminhão",
    "marca": "Volkswagen",
    "modelo": "Delivery 9.170"
  },
  {
    "tipo": "Caminhão",
    "marca": "Volkswagen",
    "modelo": "Delivery 11.180"
  },
  {
    "tipo": "Caminhão",
    "marca": "Volkswagen",
    "modelo": "Constellation 17.280"
  },
  {
    "tipo": "Caminhão",
    "marca": "Volkswagen",
    "modelo": "Constellation 24.280"
  },
  {
    "tipo": "Caminhão",
    "marca": "Volkswagen",
    "modelo": "Outro"
  },
  {
    "tipo": "Caminhão",
    "marca": "Ford",
    "modelo": "Cargo 816"
  },
  {
    "tipo": "Caminhão",
    "marca": "Ford",
    "modelo": "Cargo 1119"
  },
  {
    "tipo": "Caminhão",
    "marca": "Ford",
    "modelo": "Cargo 1519"
  },
  {
    "tipo": "Caminhão",
    "marca": "Ford",
    "modelo": "Cargo 2429"
  },
  {
    "tipo": "Caminhão",
    "marca": "Ford",
    "modelo": "Outro"
  },
  {
    "tipo": "Caminhão",
    "marca": "Iveco",
    "modelo": "Daily 35S14"
  },
  {
    "tipo": "Caminhão",
    "marca": "Iveco",
    "modelo": "Tector 170E28"
  },
  {
    "tipo": "Caminhão",
    "marca": "Iveco",
    "modelo": "Stralis"
  },
  {
    "tipo": "Caminhão",
    "marca": "Iveco",
    "modelo": "S-Way"
  },
  {
    "tipo": "Caminhão",
    "marca": "Iveco",
    "modelo": "Outro"
  },
  {
    "tipo": "Caminhão",
    "marca": "Scania",
    "modelo": "P280"
  },
  {
    "tipo": "Caminhão",
    "marca": "Scania",
    "modelo": "P360"
  },
  {
    "tipo": "Caminhão",
    "marca": "Scania",
    "modelo": "R450"
  },
  {
    "tipo": "Caminhão",
    "marca": "Scania",
    "modelo": "R500"
  },
  {
    "tipo": "Caminhão",
    "marca": "Scania",
    "modelo": "S650"
  },
  {
    "tipo": "Caminhão",
    "marca": "Scania",
    "modelo": "Outro"
  },
  {
    "tipo": "Caminhão",
    "marca": "Volvo",
    "modelo": "FMX 370"
  },
  {
    "tipo": "Caminhão",
    "marca": "Volvo",
    "modelo": "FM 370"
  },
  {
    "tipo": "Caminhão",
    "marca": "Volvo",
    "modelo": "FH 460"
  },
  {
    "tipo": "Caminhão",
    "marca": "Volvo",
    "modelo": "FH 500"
  },
  {
    "tipo": "Caminhão",
    "marca": "Volvo",
    "modelo": "Outro"
  },
  {
    "tipo": "Caminhão",
    "marca": "DAF",
    "modelo": "XF 480"
  },
  {
    "tipo": "Caminhão",
    "marca": "DAF",
    "modelo": "XG 480"
  },
  {
    "tipo": "Caminhão",
    "marca": "DAF",
    "modelo": "Outro"
  },
  {
    "tipo": "Caminhão",
    "marca": "MAN",
    "modelo": "TGX 28.440"
  },
  {
    "tipo": "Caminhão",
    "marca": "MAN",
    "modelo": "TGS 26.360"
  },
  {
    "tipo": "Caminhão",
    "marca": "MAN",
    "modelo": "Outro"
  },
  {
    "tipo": "Caminhão",
    "marca": "Agrale",
    "modelo": "6000"
  },
  {
    "tipo": "Caminhão",
    "marca": "Agrale",
    "modelo": "8500"
  },
  {
    "tipo": "Caminhão",
    "marca": "Agrale",
    "modelo": "Outro"
  }
];
