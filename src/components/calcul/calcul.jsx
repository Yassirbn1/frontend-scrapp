// Make sure all imports are at the top
import './calcul.css';

// Fonction pour calculer la Quantité PF
export const calculateQuantitéPF = (quantitéEntreePr, shiftData) => {
    const totalPurge = shiftData
        .filter(shift => shift.shift === 1)
        .reduce((acc, shift) => acc + (shift.purge || 0), 0);
    return quantitéEntreePr - totalPurge;
};

// Fonction pour calculer le Total Consommé
export const calculateTotalConsommé = (quantitéEntreePr, shiftData) => {
    const quantitéPF = calculateQuantitéPF(quantitéEntreePr, shiftData);
    const totalBavures = shiftData
        .filter(shift => shift.shift === 3)
        .reduce((acc, shift) => acc + (shift.bavures || 0), 0);
    return quantitéPF + totalBavures;
};

// Fonction pour calculer le pourcentage de Quantité PF consommée
export const calculatePercentConsomméPF = (quantitéEntreePr, shiftData) => {
    const quantitéPF = calculateQuantitéPF(quantitéEntreePr, shiftData);
    const totalConsommé = calculateTotalConsommé(quantitéEntreePr, shiftData);
    return totalConsommé > 0 ? (quantitéPF / totalConsommé) * 100 : 0;
};

// Fonction pour calculer le pourcentage de Rejets
export const calculatePercentRejets = (shiftData) => {
    const totalBavures = shiftData
        .filter(shift => shift.shift === 3)
        .reduce((acc, shift) => acc + (shift.bavures || 0), 0);
    const totalConsommé = calculateTotalConsommé(0, shiftData); // Passer quantitéEntreePr comme 0 ici
    return totalConsommé > 0 ? (totalBavures / totalConsommé) * 100 : 0;
};
