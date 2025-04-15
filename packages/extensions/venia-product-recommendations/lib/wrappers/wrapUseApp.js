import useSyncMSEToLocalStorage from '../hooks/useSyncMSEToLocalStorage';
export default function wrapUseApp(origUseApp) {
  return function(props) {
    useSyncMSEToLocalStorage();
    return origUseApp(props);
  };
}
