export type CertificateDesign = "red" | "gray" | "charcoal";
export type CertificateMediaType =
  | "application/pdf"
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/gif";
export type CertificateId =
  | "handling-arrays"
  | "time-management"
  | "codeblaze-hackathon"
  | "prototyping-course"
  | "webdiv-certificate";

type CertificateRecord = {
  id: CertificateId;
  title: string;
  filename: string;
  url: string;
  mediaType: CertificateMediaType;
  design: CertificateDesign;
  cardColor: string;
  issuer?: string;
  verifyUrl?: string;
};
export type Certificate = CertificateRecord;

const certificateUrl = (filename: string) =>
  `/certificates/${encodeURIComponent(filename)}`;

export const CERTIFICATES: readonly Certificate[] = [
  {
    id: "handling-arrays",
    title: "Handling Arrays in C Programming",
    filename: "1-c825bcf2-a68f-4df0-a791-2656a5b3946d.pdf",
    url: certificateUrl("1-c825bcf2-a68f-4df0-a791-2656a5b3946d.pdf"),
    mediaType: "application/pdf",
    design: "red",
    cardColor: "#7A2945",
    issuer: "Infosys Springboard",
    verifyUrl: "https://verify.onwingspan.com",
  },
  {
    id: "time-management",
    title: "Time Management",
    filename: "1-cdee1ca4-b336-4b83-99d8-0cb9d7413b54.pdf",
    url: certificateUrl("1-cdee1ca4-b336-4b83-99d8-0cb9d7413b54.pdf"),
    mediaType: "application/pdf",
    design: "gray",
    cardColor: "#B1A66C",
    issuer: "Infosys Springboard",
    verifyUrl: "https://verify.onwingspan.com",
  },
  {
    id: "codeblaze-hackathon",
    title: "Codeblaze Hackathon Certificate of Participation",
    filename: "Codeblaze Hackathon Certificate of participation -- __name__.pdf",
    url: certificateUrl(
      "Codeblaze Hackathon Certificate of participation -- __name__.pdf",
    ),
    mediaType: "application/pdf",
    design: "red",
    cardColor: "#7A2945",
    issuer: "Synergia",
  },
  {
    id: "prototyping-course",
    title: "Prototyping Course 2022-23",
    filename: "course_certificate.pdf",
    url: certificateUrl("course_certificate.pdf"),
    mediaType: "application/pdf",
    design: "gray",
    cardColor: "#B1A66C",
    issuer: "Technical Career Education",
  },
  {
    id: "webdiv-certificate",
    title: "WEBDIV Certificate",
    filename: "WEBDIV_CERTIFICATE_Shamanth krishna V.R.pdf",
    url: certificateUrl("WEBDIV_CERTIFICATE_Shamanth krishna V.R.pdf"),
    mediaType: "application/pdf",
    design: "charcoal",
    cardColor: "#82958B",
    issuer: "Challengers",
  },
];

// The deck order is back-to-front. This keeps all three existing card colors
// visible while preserving each certificate's stable identity as it shuffles.
export const INITIAL_DECK_ORDER = [
  "webdiv-certificate",
  "prototyping-course",
  "codeblaze-hackathon",
  "handling-arrays",
  "time-management",
] as const satisfies readonly CertificateId[];

