export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  context: SecurityRuleContext;
  rawMessage: string;

  constructor(context: SecurityRuleContext) {
    const prettyContext = JSON.stringify(context, null, 2);
    const message = `Firestore Permission Error: The following request was denied by Firestore Security Rules:\n${prettyContext}`;
    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;
    this.rawMessage = message;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, FirestorePermissionError);
    }
  }

  toString() {
    return this.message;
  }
}
