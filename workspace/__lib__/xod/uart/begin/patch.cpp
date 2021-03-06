#pragma XOD evaluate_on_pin disable
#pragma XOD evaluate_on_pin enable input_UPD

node {
    void evaluate(Context ctx) {
        if (!isInputDirty<input_UPD>(ctx))
            return;
        auto uart = getValue<input_UART>(ctx);
        uart->begin();
        emitValue<output_DONE>(ctx, 1);
    }
}
