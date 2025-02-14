/* eslint-disable react/prop-types */
const serverIP = `${window.location.protocol}//${window.location.hostname}:5001`;
const FileComponent = ({ filePath }) => {
  if (!filePath) {
    return <p>No file path provided.</p>;
  }

  // Extract the file extension
  const fileExtension = filePath.split(".").pop().toLowerCase();
  const fileUrl = `${serverIP}/uploads/${filePath}`;

  // Render based on file type
  switch (fileExtension) {
    case "mp4":
    case "webm":
    case "ogg": // Video types
      return (
        <div className="w-full max-w-3xl mx-auto p-4">
          <p className="text-lg font-semibold">Video File:</p>
          <video
            controls
            className="w-full max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh] lg:max-h-[80vh] rounded-lg shadow-lg"
          >
            <source src={fileUrl} type={`video/${fileExtension}`} />
            Your browser does not support the video tag.
          </video>
          <a
            href={fileUrl}
            download
            className="mt-4 inline-block text-blue-500 hover:text-blue-700 underline"
          >
            Download Video
          </a>
        </div>
      );

    case "mp3":
    case "wav":
    case "aac": // Audio types
      return (
        <div className="w-full max-w-3xl mx-auto p-4">
          <p className="text-lg font-semibold">Audio File:</p>
          <audio controls className="w-full rounded-lg shadow-lg">
            <source src={fileUrl} type={`audio/${fileExtension}`} />
            Your browser does not support the audio tag.
          </audio>
          <a
            href={fileUrl}
            download
            className="mt-4 inline-block text-blue-500 hover:text-blue-700 underline"
          >
            Download Audio
          </a>
        </div>
      );

    case "pdf": // PDF type
      return (
        <div className="w-full max-w-3xl mx-auto p-4">
          <p className="text-lg font-semibold">PDF File:</p>
          <iframe
            src={fileUrl}
            title="PDF Viewer"
            className="w-full h-[60vh] sm:h-[70vh] md:h-[80vh] rounded-lg shadow-lg"
          />
          <a
            href={fileUrl}
            download
            className="mt-4 inline-block text-blue-500 hover:text-blue-700 underline"
          >
            Download PDF
          </a>
        </div>
      );

    case "jpg":
    case "jpeg":
    case "png":
    case "gif": // Image types
      return (
        <div className="w-full max-w-3xl mx-auto p-4">
          <p className="text-lg font-semibold">Image File:</p>
          <img
            src={fileUrl}
            alt={`Preview of ${filePath}`}
            className="w-full max-h-[50vh] object-contain rounded-lg shadow-lg"
          />
          <a
            href={fileUrl}
            download
            className="mt-4 inline-block text-blue-500 hover:text-blue-700 underline"
          >
            Download Image
          </a>
        </div>
      );

    default:
      return (
        <div className="w-full max-w-3xl mx-auto p-4">
          <p className="text-lg font-semibold">Unsupported File Type:</p>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            {filePath}
          </a>
          <a
            href={fileUrl}
            download
            className="mt-4 inline-block text-blue-500 hover:text-blue-700 underline"
          >
            Download File
          </a>
        </div>
      );
  }
};

export default FileComponent;
