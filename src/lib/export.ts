import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Process, Subprocess, Task } from "@/types/data";
import { format } from "date-fns";

/*
 * Here I have made use of AI to generate the code for the export to PDF and CSV.
 * where, the basic prompt was to export the processes to PDF and CSV.
 */

export function exportToPDF(processes: Process[]) {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text("Process Review Report", 14, 22);

  // Generation date
  doc.setFontSize(10);
  doc.text(`Generated: ${format(new Date(), "PPpp")}`, 14, 30);

  let yPosition = 40;

  processes.forEach((process, pIndex) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    // Process header
    doc.setFontSize(14);
    doc.setTextColor(33, 150, 243);
    doc.text(`Process ${pIndex + 1}: ${process.name}`, 14, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(process.description, 14, yPosition, { maxWidth: 180 });
    yPosition += 10;

    doc.setTextColor(0, 0, 0);
    doc.text(`Status: ${process.status}`, 14, yPosition);
    yPosition += 5;

    if (process.lastUpdatedBy) {
      doc.text(
        `Last Updated: ${process.lastUpdatedBy} - ${format(
          new Date(process.lastUpdatedAt),
          "PPp"
        )}`,
        14,
        yPosition
      );
      yPosition += 5;
    }

    if (process.comments.length > 0) {
      doc.text(`Comments: ${process.comments.length}`, 14, yPosition);
      yPosition += 10;
    } else {
      yPosition += 5;
    }

    // Subprocesses table
    process.subprocesses.forEach((subprocess) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      const taskData = subprocess.tasks.map((task) => [
        task.name,
        task.status,
        task.lastUpdatedBy || "-",
        task.comments.length.toString(),
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [
          [
            `Subprocess: ${subprocess.name}`,
            "Status",
            "Updated By",
            "Comments",
          ],
        ],
        body: taskData,
        theme: "grid",
        headStyles: { fillColor: [66, 66, 66] },
        styles: { fontSize: 8 },
        margin: { left: 14 },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 10;
    });

    yPosition += 5;
  });

  doc.save(`process-review-${format(new Date(), "yyyy-MM-dd")}.pdf`);
}

export function exportToCSV(processes: Process[]) {
  const rows: string[][] = [
    [
      "Process",
      "Subprocess",
      "Task",
      "Status",
      "Last Updated By",
      "Last Updated At",
      "Comments Count",
    ],
  ];

  processes.forEach((process) => {
    process.subprocesses.forEach((subprocess) => {
      subprocess.tasks.forEach((task) => {
        rows.push([
          process.name,
          subprocess.name,
          task.name,
          task.status,
          task.lastUpdatedBy || "-",
          task.lastUpdatedAt || "-",
          task.comments.length.toString(),
        ]);
      });
    });
  });

  const csvContent = rows
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `process-review-${format(new Date(), "yyyy-MM-dd")}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
