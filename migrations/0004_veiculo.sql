-- O produto "carro" passou a se chamar "veiculo" (carro, moto, caminhão, utilitário).
UPDATE leads SET objetivo = 'veiculo' WHERE objetivo = 'carro';
