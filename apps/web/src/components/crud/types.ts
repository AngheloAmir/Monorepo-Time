export interface Suggestion {
  name: string;
  urlparams: string;
  content: string;
}

export interface CrudItem {
  label: string;
  route: string;
  methods: string;
  description: string;
  sampleInput: string;
  suggested: Suggestion[];
  expectedOutcome: string;
  availableFor: string;
}

export interface CrudCategory {
  category: string;
  devurl: string;
  produrl: string;
  items: CrudItem[];
}
