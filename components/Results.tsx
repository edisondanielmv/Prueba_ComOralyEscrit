import React, { useEffect, useState } from 'react';
import { ExamResult, User } from '../types';
import { AlertTriangle, Check, X, Code, ChevronDown, ChevronUp, Copy, ExternalLink } from 'lucide-react';

interface ResultsProps {
  result: ExamResult;
  user: User;
}

const Results: React.FC<ResultsProps> = ({ result, user }) => {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [showScriptHelp, setShowScriptHelp] = useState(false);

  // --- CALCULATION LOGIC (SCALE OF 20) ---
  const rawPercentage = result.maxScore > 0 ? (result.totalScore / result.maxScore) : 0;
  const gradeOver20 = rawPercentage * 20;
  
  // Grade Color Logic
  let gradeColor = 'text-red-600';
  let gradeBg = 'bg-red-50 border-red-200';
  if (gradeOver20 >= 16) { 
    gradeColor = 'text-green-600';
    gradeBg = 'bg-green-50 border-green-200';
  } else if (gradeOver20 >= 12) { 
    gradeColor = 'text-yellow-600';
    gradeBg = 'bg-yellow-50 border-yellow-200';
  }

  // Google Sheets Submission Logic
  const submitToGoogleSheets = async () => {
    setSaveStatus('saving');
    
    const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby_5_3gT2_eq8Y80WW-fbGAVRcPvy7L9DlAziNyLJBSpOR2VT4Mo2Knu-B9qwxBpeoJew/exec';

    if (!WEB_APP_URL) {
        setTimeout(() => setSaveStatus('error'), 1500);
        return;
    }

    // Construct a DETAILED report summary
    const detailedReport = result.details.map((d, idx) => {
       const qNum = idx + 1;
       const answerText = d.userAnswer 
          ? d.userAnswer.replace(/[\r\n]+/g, ' ').trim() 
          : "SIN RESPUESTA";
       
       let feedbackText = "";
       if (d.aiAnalysis) {
           feedbackText = d.aiAnalysis.feedback.replace(/[\r\n]+/g, ' ').trim();
       } else {
           feedbackText = d.isCorrect ? "CORRECTO" : "INCORRECTO";
       }

       // Format: [P# | Earned/Max pts] R: Answer /// F: Feedback
       return `[P${qNum} | ${d.pointsEarned.toFixed(2)}/${d.maxPoints} pts] R: ${answerText} /// F: ${feedbackText}`;
    }).join('\n-----------------------------------\n');

    const payload = {
      fullName: user.fullName,
      cedula: user.cedula,
      score: gradeOver20.toFixed(2), 
      maxScore: "20",
      percentage: (rawPercentage * 100).toFixed(1) + '%',
      detailedReport: detailedReport
    };

    try {
      await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      setSaveStatus('success');
    } catch (error) {
      console.error('Error saving to sheets', error);
      setSaveStatus('error');
    }
  };

  useEffect(() => {
    if (saveStatus === 'idle') {
       submitToGoogleSheets();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Score Card */}
        <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border-t-8 ${gradeOver20 >= 12 ? 'border-green-500' : 'border-red-500'}`}>
          <div className="p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Informe de Resultados</h1>
            <p className="text-gray-500 mb-6">Estudiante: <span className="font-semibold text-gray-800">{user.fullName}</span> ({user.cedula})</p>
            
            <div className="flex justify-center items-center mb-6">
              <div className={`w-48 h-48 rounded-full flex flex-col items-center justify-center border-4 ${gradeOver20 >= 12 ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'}`}>
                <span className={`text-6xl font-extrabold ${gradeColor}`}>{gradeOver20.toFixed(2)}</span>
                <span className="text-gray-400 text-base font-medium mt-1">sobre 20.00</span>
              </div>
            </div>
            
            <div className={`inline-flex flex-col items-center px-6 py-3 rounded-xl ${gradeBg}`}>
               <span className={`text-xl font-bold ${gradeColor}`}>
                  {gradeOver20 >= 14 ? 'EXCELENTE' : gradeOver20 >= 12 ? 'APROBADO' : 'REPROBADO'}
               </span>
               <span className="text-sm text-gray-600">
                  Puntaje Bruto: {result.totalScore.toFixed(1)} / {result.maxScore} pts
               </span>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3">
              {saveStatus === 'saving' && (
                  <span className="inline-flex items-center gap-2 text-sm text-indigo-600 font-medium bg-indigo-50 px-4 py-2 rounded-full animate-pulse">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                      Guardando calificación y retroalimentación en Google Sheets...
                  </span>
              )}
              {saveStatus === 'success' && (
                  <span className="inline-flex items-center gap-2 text-sm text-emerald-700 font-bold bg-emerald-100 px-4 py-2 rounded-full">
                      <Check className="w-4 h-4"/> Resultados registrados correctamente
                  </span>
              )}
              
              {saveStatus === 'error' && (
                <div className="text-sm text-left w-full max-w-lg bg-orange-50 border border-orange-200 p-4 rounded-lg mt-4 shadow-sm">
                  <div className="flex items-center gap-2 text-orange-800 font-bold mb-2">
                    <AlertTriangle className="w-4 h-4"/> 
                    Error de Conexión
                  </div>
                  <p className="text-gray-700 text-xs mb-3">
                    No se pudo guardar la nota automáticamente. Revise su conexión o la configuración del script.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* GOOGLE SHEETS SCRIPT CONFIGURATION HELP */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 ring-2 ring-indigo-500">
            <button 
                onClick={() => setShowScriptHelp(!showScriptHelp)}
                className="w-full px-6 py-4 flex items-center justify-between text-white hover:bg-gray-700 transition-colors bg-indigo-900"
            >
                <div className="flex items-center gap-3">
                    <Code className="w-5 h-5 text-green-400" />
                    <div className="text-left">
                        <h3 className="text-sm font-bold text-white">⚠️ CONFIGURACIÓN TÉCNICA (OPCIONAL)</h3>
                        <p className="text-xs text-indigo-200">Ver código para Google Apps Script si no se guardan datos.</p>
                    </div>
                </div>
                {showScriptHelp ? <ChevronUp className="w-5 h-5 text-gray-400"/> : <ChevronDown className="w-5 h-5 text-gray-400"/>}
            </button>
            
            {showScriptHelp && (
                <div className="p-6 bg-gray-900 border-t border-gray-700">
                    <p className="text-gray-300 text-sm mb-4">
                        Asegúrese de que su script en <strong>Extensiones {'>'} Apps Script</strong> sea idéntico a este:
                    </p>
                    <div className="relative group mb-4">
                        <pre className="bg-black p-4 rounded-lg text-xs text-green-400 font-mono whitespace-pre-wrap overflow-x-auto border border-gray-700">
{`function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date(),           
      data.fullName,        
      data.cedula,          
      data.score,           
      data.maxScore,        
      data.percentage,      
      data.detailedReport   // COLUMNA G
    ]);
    
    return ContentService.createTextOutput("Success");
  } catch (e) {
    return ContentService.createTextOutput("Error: " + e.toString());
  } finally {
    lock.releaseLock();
  }
}`}
                        </pre>
                    </div>
                </div>
            )}
        </div>

        {/* Detailed Feedback Display */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">Revisión Detallada</h3>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Desglose de Puntos</span>
          </div>
          <div className="divide-y divide-gray-200">
            {result.details.map((detail, idx) => (
              <div key={idx} className="p-6 hover:bg-gray-50 transition-colors group">
                <div className="flex justify-between items-start mb-3">
                   <div className="flex items-center gap-3">
                       <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded">#{idx + 1}</span>
                       <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wide">Pregunta {detail.questionId}</h4>
                   </div>
                   <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium">Valor: {detail.maxPoints} pts</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${detail.pointsEarned > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {detail.pointsEarned.toFixed(1)} pts
                        </span>
                   </div>
                </div>
                
                <div className="mb-4 pl-4 border-l-2 border-gray-200">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Tu Respuesta:</p>
                  <div className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
                    {detail.userAnswer || <span className="italic text-gray-400">Sin respuesta registrada.</span>}
                  </div>
                </div>

                {detail.aiAnalysis ? (
                   <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-3">
                     <div className="flex items-center gap-2 mb-2">
                       <Code className="w-4 h-4 text-blue-600"/>
                       <span className="text-xs font-bold text-blue-700 uppercase">Retroalimentación IA</span>
                     </div>
                     <p className="text-sm text-blue-900 leading-relaxed italic">
                       "{detail.aiAnalysis.feedback}"
                     </p>
                   </div>
                ) : (
                  <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-md ${detail.isCorrect ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                    {detail.isCorrect ? (
                      <><Check className="w-4 h-4" /> <span className="text-sm font-bold">Respuesta Correcta</span></>
                    ) : (
                      <><X className="w-4 h-4" /> <span className="text-sm font-bold">Respuesta Incorrecta</span></>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;