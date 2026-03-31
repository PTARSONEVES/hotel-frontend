import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useTheme } from '../../../context/ThemeContext';

export default function ExportPDF({ targetRef, fileName = 'relatorio-manutencao', title = 'Relatório de Manutenção' }) {
    const { theme } = useTheme();

    const handleExportPDF = async () => {
        if (!targetRef || !targetRef.current) {
            alert('Erro ao gerar PDF: referência não encontrada');
            return;
        }

        try {
            const element = targetRef.current;
            
            // Mostrar loading
            const loadingToast = document.createElement('div');
            loadingToast.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg z-50';
            loadingToast.innerHTML = '📄 Gerando PDF...';
            document.body.appendChild(loadingToast);

            // Capturar o elemento como imagem
            const canvas = await html2canvas(element, {
                scale: 2,
                backgroundColor: theme === 'dracula' ? '#282a36' : theme === 'dark' ? '#111827' : '#ffffff',
                logging: false,
                useCORS: true
            });

            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            const pdf = new jsPDF('p', 'mm', 'a4');
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`${fileName}_${new Date().toISOString().split('T')[0]}.pdf`);

            // Remover loading
            loadingToast.remove();
            
            // Mostrar sucesso
            const successToast = document.createElement('div');
            successToast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
            successToast.innerHTML = '✅ PDF gerado com sucesso!';
            document.body.appendChild(successToast);
            setTimeout(() => successToast.remove(), 3000);

        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            alert('Erro ao gerar PDF');
            
            // Remover loading se existir
            const loading = document.querySelector('.fixed.top-4.right-4.bg-blue-500');
            if (loading) loading.remove();
        }
    };

    const getButtonClasses = () => {
        if (theme === 'dracula') {
            return 'bg-[#bd93f9] hover:bg-[#ff79c6] text-white';
        }
        if (theme === 'dark') {
            return 'bg-blue-600 hover:bg-blue-700 text-white';
        }
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    };

    return (
        <button
            onClick={handleExportPDF}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${getButtonClasses()}`}
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Exportar PDF</span>
        </button>
    );
}