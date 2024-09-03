// Fonction pour calculer la Quantité PF
export const calculateQuantitéPF = (quantiteEntreePr, shiftData) => {
    if (quantiteEntreePr == null || !Array.isArray(shiftData)) return 0; // Protection contre les valeurs nulles et les types incorrects
    const totalPurge = shiftData
        .filter(shift => shift.shift === 1)
        .reduce((acc, shift) => acc + (shift.purge || 0), 0);
    const quantitéPF = quantiteEntreePr - totalPurge;
    return Math.max(quantitéPF, 0); // Assurez-vous que la valeur est valide
};

// Fonction pour calculer le Total Consommé
export const calculateTotalConsommé = (quantiteEntreePr, shiftData) => {
    if (quantiteEntreePr == null || !Array.isArray(shiftData)) return 0; // Protection contre les valeurs nulles et les types incorrects
    const quantitéPF = calculateQuantitéPF(quantiteEntreePr, shiftData);
    const totalBavures = shiftData
        .filter(shift => shift.shift === 3)
        .reduce((acc, shift) => acc + (shift.bavures || 0), 0);
    const totalConsommé = quantitéPF + totalBavures;
    return Math.max(totalConsommé, 0); // Assurez-vous que la valeur est valide
};

// Fonction pour calculer le pourcentage de Quantité PF consommée
export const calculatePercentConsomméPF = (quantiteEntreePr, shiftData) => {
    if (quantiteEntreePr == null || !Array.isArray(shiftData)) return 0; // Protection contre les valeurs nulles et les types incorrects
    const quantitéPF = calculateQuantitéPF(quantiteEntreePr, shiftData);
    const totalConsommé = calculateTotalConsommé(quantiteEntreePr, shiftData);

    const pourcentage = totalConsommé > 0 ? Math.max((quantitéPF / totalConsommé) * 100, 0) : 0;
    
    return parseFloat(pourcentage.toFixed(2)); // Limite à deux chiffres après la virgule et retourne un nombre
};


// Fonction pour calculer le pourcentage de Rejets
export const calculatePercentRejets = (shiftData) => {
    if (!Array.isArray(shiftData)) return 0; // Protection contre les types incorrects
    const totalBavures = shiftData
        .filter(shift => shift.shift === 3)
        .reduce((acc, shift) => acc + (shift.bavures || 0), 0);
    const totalConsommé = calculateTotalConsommé(0, shiftData); // Utiliser 0 ici car quantitéEntreePr est absente
    return totalConsommé > 0 ? Math.max((totalBavures / totalConsommé) * 100, 0) : 0;
};
