export interface ScriptInputs {
  script1: string;
  script2: string;
  script3: string;
}

export enum VerificationStatus {
  Verified = 'Verified',
  PartiallyVerified = 'Partially Verified',
  Unverified = 'Unverified'
}

export interface VerificationItem {
  claim: string;
  status: VerificationStatus;
  sourceNote: string;
}

export interface ImagePrompt {
  type: 'Feature' | 'Topic';
  context?: string;
  prompt: string;
}

export interface InternalLink {
  anchorText: string;
  placementContext: string;
}

export interface BlogData {
  seo: {
    title: string;
    metaDescription: string;
  };
  tableOfContents: string[];
  blogContent: string;
  urduContent: string;
  verificationReport: VerificationItem[];
  imagePrompts: ImagePrompt[];
  internalLinks: InternalLink[];
}

export interface GenerationState {
  isGenerating: boolean;
  stage: 'idle' | 'merging' | 'fact-checking' | 'writing' | 'translating' | 'complete' | 'error';
  error?: string;
  data?: BlogData;
}