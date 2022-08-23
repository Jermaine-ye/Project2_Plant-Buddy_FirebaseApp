export default function Nurseries() {
  const iFrameUrl = `https://www.google.com/maps/embed/v1/search?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=plant+nurseries+Singapore`;

  return (
    <div>
      <iframe
        title="maps"
        width="100%"
        height="500"
        frameBorder="0"
        // style="border:0"
        referrerPolicy="no-referrer-when-downgrade"
        src={iFrameUrl}
        allowFullScreen
      ></iframe>
    </div>
  );
}
