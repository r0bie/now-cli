//      

import generateCertForDeploy from './generate-cert-for-deploy';
import * as Errors from '../errors';

                               
                                   
                             
                          
                                   
                                    
                         
                            
                                 
                                 
                                  
                                   
                                
                              
                                 
                           

export default async function createDeploy(
  output        ,
  now     ,
  contextName        ,
  paths          ,
  createArgs        
) {
  try {
    return await now.create(paths, createArgs);
  } catch (error) {
    // Means that the domain used as a suffix no longer exists
    if (error.code === 'domain_missing') {
      return new Errors.DomainNotFound(error.value);
    }

    // If the domain used as a suffix is not verified, we fail
    if (error.code === 'domain_not_verified') {
      return new Errors.DomainNotVerified(error.value);
    }

    // If the user doesn't have permissions over the domain used as a suffix we fail
    if (error.code === 'forbidden') {
      return new Errors.DomainPermissionDenied(error.value, contextName);
    }

    if (error.code === 'bad_request' && error.keyword) {
      return new Errors.SchemaValidationFailed(error.message, error.keyword, error.dataPath, error.params);
    }

    // If the cert is missing we try to generate a new one and the retry
    if (error.code === 'cert_missing') {
      const result = await generateCertForDeploy(
        output,
        now,
        contextName,
        error.value
      );
      if (
        result instanceof Errors.CantSolveChallenge ||
        result instanceof Errors.CantGenerateWildcardCert ||
        result instanceof Errors.DomainConfigurationError ||
        result instanceof Errors.DomainNameserversNotFound ||
        result instanceof Errors.DomainNotVerified ||
        result instanceof Errors.DomainPermissionDenied ||
        result instanceof Errors.DomainsShouldShareRoot ||
        result instanceof Errors.DomainValidationRunning ||
        result instanceof Errors.DomainVerificationFailed ||
        result instanceof Errors.InvalidWildcardDomain ||
        result instanceof Errors.CDNNeedsUpgrade ||
        result instanceof Errors.TooManyCertificates ||
        result instanceof Errors.TooManyRequests
      ) {
        return result;
      } 
        return createDeploy(output, now, contextName, paths, createArgs);
      
    }

    // If the error is unknown, we just throw
    throw error;
  }
}
