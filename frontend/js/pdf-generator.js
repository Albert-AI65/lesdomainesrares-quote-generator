/**
 * PDF Generator Module
 * Generates professional PDF quotes using jsPDF and jsPDF-AutoTable
 */

import { collectFormData } from './form-handler.js';
import { showNotification, formatPrice } from './utils.js';

// Load jsPDF and AutoTable from CDN
const JSPDF_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
const AUTOTABLE_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js';

let jsPDFLoaded = false;
let autoTableLoaded = false;

/**
 * Load external scripts dynamically
 */
async function loadScript(url) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${url}"]`)) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

/**
 * Initialize PDF generator
 */
export async function initPDFGenerator() {
    const btnExport = document.getElementById('btn-export-pdf');
    if (btnExport) {
        btnExport.addEventListener('click', handleExportPDF);
    }
    
    // Preload libraries
    try {
        await loadScript(JSPDF_CDN);
        jsPDFLoaded = true;
        await loadScript(AUTOTABLE_CDN);
        autoTableLoaded = true;
        console.log('✅ PDF libraries loaded');
    } catch (error) {
        console.error('Failed to load PDF libraries:', error);
    }
}

/**
 * Handle PDF export
 */
async function handleExportPDF() {
    const data = collectFormData();
    
    // Validate required fields
    if (!data.nomClient || !data.titre) {
        showNotification('Le nom du client et le titre sont requis', 'warning');
        return;
    }
    
    try {
        showNotification('Génération du PDF en cours...', 'info', 2000);
        await generatePDF(data);
        showNotification('PDF généré avec succès !', 'success');
    } catch (error) {
        console.error('PDF generation error:', error);
        showNotification('Erreur lors de la génération du PDF', 'error');
    }
}

/**
 * Generate PDF document
 */
async function generatePDF(data) {
    if (!jsPDFLoaded || !autoTableLoaded) {
        throw new Error('PDF libraries not loaded');
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configuration
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;
    
    // Colors
    const primaryColor = [44, 62, 80]; // #2c3e50
    const secondaryColor = [52, 152, 219]; // #3498db
    const textColor = [50, 50, 50];
    const lightGray = [240, 240, 240];
    
    // === HEADER ===
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('DEVIS', margin, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Les Domaines Rares', pageWidth - margin, 15, { align: 'right' });
    doc.text('Événements d\'Exception', pageWidth - margin, 22, { align: 'right' });
    
    yPos = 50;
    
    // === DOCUMENT INFO ===
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    const devisDate = new Date().toLocaleDateString('fr-FR');
    const devisNum = `DEV-${Date.now().toString().slice(-8)}`;
    
    doc.text(`N° ${devisNum}`, margin, yPos);
    doc.text(`Date: ${devisDate}`, pageWidth - margin, yPos, { align: 'right' });
    yPos += 15;
    
    // === CLIENT INFO ===
    doc.setFillColor(...lightGray);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 35, 'F');
    
    yPos += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('CLIENT', margin + 5, yPos);
    
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(data.nomClient, margin + 5, yPos);
    
    if (data.entrepriseClient) {
        yPos += 5;
        doc.text(data.entrepriseClient, margin + 5, yPos);
    }
    
    if (data.emailClient) {
        yPos += 5;
        doc.text(data.emailClient, margin + 5, yPos);
    }
    
    if (data.telephoneClient) {
        yPos += 5;
        doc.text(data.telephoneClient, margin + 5, yPos);
    }
    
    yPos += 15;
    
    // === EVENT INFO ===
    if (data.titre && data.adresse) {
        doc.setFillColor(...secondaryColor);
        doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('LIEU DE L\'ÉVÉNEMENT', margin + 5, yPos + 5.5);
        
        yPos += 12;
        doc.setTextColor(...textColor);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(data.titre, margin, yPos);
        
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const adresseLines = doc.splitTextToSize(data.adresse, pageWidth - 2 * margin);
        doc.text(adresseLines, margin, yPos);
        yPos += adresseLines.length * 5 + 5;
    }
    
    // === PRESENTATION TEXT ===
    if (data.textePresentation) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const presentationLines = doc.splitTextToSize(data.textePresentation, pageWidth - 2 * margin);
        doc.text(presentationLines, margin, yPos);
        yPos += presentationLines.length * 5 + 8;
    }
    
    // === EVENT DETAILS ===
    if (data.dateEvenement || data.nbPersonnes || data.typeEvenement) {
        const details = [];
        if (data.dateEvenement) {
            const eventDate = new Date(data.dateEvenement).toLocaleDateString('fr-FR');
            details.push(`Date: ${eventDate}`);
        }
        if (data.nbPersonnes) {
            details.push(`Participants: ${data.nbPersonnes} personnes`);
        }
        if (data.typeEvenement) {
            details.push(`Type: ${data.typeEvenement}`);
        }
        
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.text(details.join(' | '), margin, yPos);
        yPos += 10;
    }
    
    // Check if new page needed
    if (yPos > pageHeight - 100) {
        doc.addPage();
        yPos = margin;
    }
    
    // === PRESTATIONS TABLE ===
    if (data.prestations && data.prestations.length > 0) {
        const tableData = data.prestations.map(p => {
            const total = p.quantite * p.prixUnitaire;
            return [
                p.description,
                p.quantite.toString(),
                formatPrice(p.prixUnitaire),
                formatPrice(total)
            ];
        });
        
        doc.autoTable({
            startY: yPos,
            head: [['Description', 'Qté', 'Prix Unit. HT', 'Total HT']],
            body: tableData,
            theme: 'striped',
            headStyles: {
                fillColor: primaryColor,
                textColor: [255, 255, 255],
                fontSize: 10,
                fontStyle: 'bold',
                halign: 'center'
            },
            bodyStyles: {
                fontSize: 9,
                textColor: textColor
            },
            columnStyles: {
                0: { cellWidth: 'auto', halign: 'left' },
                1: { cellWidth: 25, halign: 'center' },
                2: { cellWidth: 35, halign: 'right' },
                3: { cellWidth: 35, halign: 'right' }
            },
            margin: { left: margin, right: margin }
        });
        
        yPos = doc.lastAutoTable.finalY + 10;
    }
    
    // === TOTALS ===
    const totals = calculateTotals(data.prestations);
    const totalsX = pageWidth - margin - 70;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    doc.text('Sous-total HT:', totalsX, yPos);
    doc.text(formatPrice(totals.ht), totalsX + 50, yPos, { align: 'right' });
    yPos += 6;
    
    doc.text('TVA (20%):', totalsX, yPos);
    doc.text(formatPrice(totals.tva), totalsX + 50, yPos, { align: 'right' });
    yPos += 8;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setFillColor(...lightGray);
    doc.rect(totalsX - 5, yPos - 5, 75, 10, 'F');
    doc.text('Total TTC:', totalsX, yPos);
    doc.text(formatPrice(totals.ttc), totalsX + 50, yPos, { align: 'right' });
    yPos += 15;
    
    // === ACCESS INFO ===
    if (data.informationsAcces) {
        if (yPos > pageHeight - 50) {
            doc.addPage();
            yPos = margin;
        }
        
        doc.setFillColor(...secondaryColor);
        doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('INFORMATIONS D\'ACCÈS', margin + 5, yPos + 5.5);
        
        yPos += 12;
        doc.setTextColor(...textColor);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const accesLines = doc.splitTextToSize(data.informationsAcces, pageWidth - 2 * margin);
        doc.text(accesLines, margin, yPos);
        yPos += accesLines.length * 5 + 10;
    }
    
    // === NOTES ===
    if (data.notes) {
        if (yPos > pageHeight - 40) {
            doc.addPage();
            yPos = margin;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('NOTES', margin, yPos);
        yPos += 6;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const notesLines = doc.splitTextToSize(data.notes, pageWidth - 2 * margin);
        doc.text(notesLines, margin, yPos);
        yPos += notesLines.length * 5 + 10;
    }
    
    // === FOOTER ===
    const footerY = pageHeight - 20;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'italic');
    doc.text('Devis valable 30 jours - Les Domaines Rares', pageWidth / 2, footerY, { align: 'center' });
    doc.text(`Généré le ${devisDate}`, pageWidth / 2, footerY + 5, { align: 'center' });
    
    // === SAVE PDF ===
    const filename = `Devis_${data.nomClient.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    doc.save(filename);
}

/**
 * Calculate totals from prestations
 */
function calculateTotals(prestations) {
    let ht = 0;
    
    if (prestations && prestations.length > 0) {
        ht = prestations.reduce((sum, p) => sum + (p.quantite * p.prixUnitaire), 0);
    }
    
    const tva = ht * 0.20;
    const ttc = ht + tva;
    
    return { ht, tva, ttc };
}