use solana_program::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, msg, pubkey::Pubkey,
};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    msg!(&format!("Hello world from program {program_id}"));
    msg!(&format!("Accounts {accounts:?}"));
    msg!(&format!("Instructions {_instruction_data:?}"));

    Ok(())
}
