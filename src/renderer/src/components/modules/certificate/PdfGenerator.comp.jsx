import React, { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import CertificateDemoImg from "@renderer/assets/images/certificate-demo.png";
import RippleButton from "@renderer/components/modules/RippleButton.comp";

const PdfGenerator = () => {
    const [loading, setLoading] = useState(false);
    const pdfRef = useRef();

    /**
     * @desc :- Download the certificate as PDF
     * created_by :- Kawsar Bin Siraj (25/02/2025)
     */
    const downloadPDF = async () => {
        try {
            setLoading(true);
            const element = pdfRef.current;
            // Capture high-resolution screenshot
            const canvas = await html2canvas(element, { scale: window.devicePixelRatio * 3 });
            const imgData = canvas.toDataURL("image/png");

            // A4 Landscape dimensions (in mm)
            const pdfWidth = 297; // A4 width in landscape
            const pdfHeight = 210; // A4 height in landscape

            // Create an A4-sized PDF in landscape mode
            const pdf = new jsPDF({
                orientation: "landscape", // Landscape mode
                unit: "mm",
                format: "a4", // A4 size
            });
            // Scale image to fit full width (297mm), height adjusted by ratio
            const imgWidth = pdfWidth; // Full width of A4
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
            // Center the image vertically if it's shorter than the page
            const yOffset = (pdfHeight - imgHeight) / 2; // Centering
            pdf.addImage(imgData, "PNG", 0, yOffset, imgWidth, imgHeight);
            pdf.save("certificate.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setTimeout(() => setLoading(false), 300);
        }
    };

    return (
        <div className="w-75">
            <div className="pdf-ref-outer border rounded overflow-hidden my-3">
                <div ref={pdfRef} style={{ padding: 0, background: "#fff" }}>
                    <img src={CertificateDemoImg} alt="CertificateDemoImg" className="img-fluid w-100" />
                </div>
            </div>
            <RippleButton
                onClickHandler={() => {
                    downloadPDF();
                }}
                rippleDelay={0}
                className={`btn px-5 text-light btn-theme-1 rounded-pill ${loading ? "disabled" : ""}`}
            >
                <b className="fw-normal fs-6 fw-500 px-4">
                    Download
                    {loading ? (
                        <div className="spinner-border spinner-border-sm border-1 ms-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    ) : null}
                </b>
            </RippleButton>
        </div>
    );
};

export default PdfGenerator;
