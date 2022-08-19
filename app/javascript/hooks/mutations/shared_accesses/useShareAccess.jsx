import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import axios from '../../../helpers/Axios';

export default function useShareAccess({ friendlyId, closeModal }) {
  const queryClient = useQueryClient();

  const shareAccess = (data) => {
    const sharedUsers = [...data.shared_users];
    return axios.post('/shared_accesses.json', { friendly_id: friendlyId, shared_users: sharedUsers });
  };

  const mutation = useMutation(shareAccess, {
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries('getSharedUsers');
      toast.success('Room shared');
    },
    onError: () => {
      toast.error('There was a problem completing that action. \n Please try again.');
    },
  });

  const onSubmit = (data) => mutation.mutateAsync(data).catch(/* Prevents the promise exception from bubbling */() => {});
  return { onSubmit, ...mutation };
}